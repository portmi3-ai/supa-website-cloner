import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// API endpoints
const SAM_API_URL = "https://api.sam.gov/entity-information/v3/entities"
const USA_SPENDING_API_URL = "https://api.usaspending.gov/api/v2/search/spending_by_award/"
const FPDS_API_URL = "https://www.fpds.gov/ezsearch/FEEDS/ATOM"

interface SearchParams {
  searchTerm: string
  agency?: string
  startDate?: string
  endDate?: string
  contractType?: string
  page?: number
  limit?: number
}

async function fetchSAMData(params: SearchParams, apiKey: string) {
  console.log('Fetching SAM.gov data...')
  try {
    const response = await fetch(`${SAM_API_URL}?q=${params.searchTerm}`, {
      headers: {
        'X-Api-Key': apiKey,
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`SAM.gov API error: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('SAM.gov results count:', data.totalRecords || 0)
    return data.entities || []
  } catch (error) {
    console.error('SAM.gov fetch error:', error)
    return []
  }
}

async function fetchUSASpendingData(params: SearchParams) {
  console.log('Fetching USASpending.gov data...')
  try {
    const requestBody = {
      filters: {
        keywords: [params.searchTerm],
        time_period: [
          {
            start_date: params.startDate || "2020-01-01",
            end_date: params.endDate || new Date().toISOString().split('T')[0]
          }
        ],
        award_type_codes: ["A", "B", "C", "D"] // Contract codes
      },
      page: params.page || 1,
      limit: params.limit || 20,
      sort: "obligated_amount",
      order: "desc"
    }

    const response = await fetch(USA_SPENDING_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`USASpending.gov API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('USASpending.gov results count:', data.results?.length || 0)
    return data.results || []
  } catch (error) {
    console.error('USASpending.gov fetch error:', error)
    return []
  }
}

async function fetchFPDSData(params: SearchParams) {
  console.log('Fetching FPDS data...')
  try {
    const queryParams = new URLSearchParams({
      q: params.searchTerm,
      agency: params.agency || ''
    })

    const response = await fetch(`${FPDS_API_URL}?${queryParams}`)
    
    if (!response.ok) {
      throw new Error(`FPDS API error: ${response.status}`)
    }

    const xmlText = await response.text()
    // Parse XML response - this is a simplified example
    // In production, you'd want to use a proper XML parser
    const contractData = xmlText.match(/<title>(.*?)<\/title>/g) || []
    console.log('FPDS results count:', contractData.length)
    return contractData.map(title => ({
      title: title.replace(/<\/?title>/g, '')
    }))
  } catch (error) {
    console.error('FPDS fetch error:', error)
    return []
  }
}

function transformAndMergeResults(samData: any[], usaSpendingData: any[], fpdsData: any[]) {
  const transformedData = []

  // Transform SAM.gov data
  samData.forEach(entity => {
    transformedData.push({
      id: entity.ueiSAM || crypto.randomUUID(),
      title: entity.entityRegistration?.legalBusinessName || 'Unnamed Entity',
      description: `${entity.entityRegistration?.businessType || ''} - ${entity.entityRegistration?.physicalAddress?.city || ''}, ${entity.entityRegistration?.physicalAddress?.stateOrProvinceCode || ''}`,
      funding_agency: null,
      funding_amount: null,
      status: 'active',
      source: 'SAM.gov',
      entity_type: entity.entityRegistration?.businessType || null,
      location: `${entity.entityRegistration?.physicalAddress?.city || ''}, ${entity.entityRegistration?.physicalAddress?.stateOrProvinceCode || ''}`,
      registration_status: entity.entityRegistration?.registrationStatus || null
    })
  })

  // Transform USASpending.gov data
  usaSpendingData.forEach(award => {
    transformedData.push({
      id: award.generated_internal_id || crypto.randomUUID(),
      title: award.recipient_name || 'Unnamed Award',
      description: award.description || '',
      funding_agency: award.awarding_agency_name || null,
      funding_amount: award.obligated_amount || null,
      submission_deadline: null,
      status: award.status || 'unknown',
      source: 'USASpending.gov',
      award_type: award.type || null,
      recipient_name: award.recipient_name || null,
      award_date: award.period_of_performance_start_date || null
    })
  })

  // Transform FPDS data
  fpdsData.forEach(contract => {
    transformedData.push({
      id: crypto.randomUUID(),
      title: contract.title || 'Unnamed Contract',
      description: '',
      funding_agency: null,
      funding_amount: null,
      status: 'active',
      source: 'FPDS',
      contract_type: 'federal'
    })
  })

  return transformedData
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { searchTerm, agency, startDate, endDate, contractType, page, limit } = await req.json()
    console.log('Searching federal data with params:', { searchTerm, agency, startDate, endDate, contractType, page, limit })

    // Fetch data from multiple sources in parallel
    const [samData, usaSpendingData, fpdsData] = await Promise.all([
      fetchSAMData({ searchTerm, agency, startDate, endDate, contractType, page, limit }, Deno.env.get("SAM_API_KEY") || ''),
      fetchUSASpendingData({ searchTerm, agency, startDate, endDate, contractType, page, limit }),
      fetchFPDSData({ searchTerm, agency, startDate, endDate, contractType, page, limit })
    ])

    // Merge and transform results
    const mergedResults = transformAndMergeResults(samData, usaSpendingData, fpdsData)
    console.log(`Total results after merging: ${mergedResults.length}`)

    return new Response(
      JSON.stringify(mergedResults),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error in searchFederalData function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "Failed to fetch federal contract data. Please try again later."
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    )
  }
})