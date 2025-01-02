import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const SAM_API_URL = "https://api.sam.gov/entity-information/v3/entities"
const USA_SPENDING_API_URL = "https://api.usaspending.gov/api/v2/search/spending_by_award/"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { searchTerm, agency, startDate, endDate } = await req.json()
    console.log('Searching federal data with params:', { searchTerm, agency, startDate, endDate })

    const apiKey = Deno.env.get('SAM_API_KEY')
    if (!apiKey) {
      console.error('SAM API key is missing')
      throw new Error('SAM API configuration is incomplete')
    }

    // Fetch from SAM.gov
    const samParams = new URLSearchParams({
      api_key: apiKey,
      q: searchTerm || '*',
      page: '0',
      size: '10',
    })

    if (agency && agency !== 'all') {
      samParams.append('organizationId', agency)
    }

    console.log('Making request to SAM.gov')
    const samResponse = await fetch(`${SAM_API_URL}?${samParams.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!samResponse.ok) {
      console.error('SAM.gov API error:', samResponse.status)
      throw new Error(`SAM.gov API error: ${samResponse.status} ${samResponse.statusText}`)
    }

    const samData = await samResponse.json()
    console.log('SAM.gov results count:', samData.totalRecords || 0)

    // Transform SAM.gov results
    const samResults = (samData.entityData || []).map((entity: any) => ({
      id: entity.entityRegistration?.ueiSAM || crypto.randomUUID(),
      title: entity.entityRegistration?.legalBusinessName || 'Unnamed Entity',
      description: entity.entityRegistration?.purposeOfRegistration || '',
      funding_agency: entity.entityRegistration?.agencyBusinessPurposeCode || null,
      funding_amount: null,
      status: 'active',
      source: 'SAM.gov'
    }))

    // Fetch from USASpending.gov
    const usaSpendingBody = {
      filters: {
        keywords: [searchTerm],
        time_period: [
          {
            start_date: startDate || "2020-01-01",
            end_date: endDate || new Date().toISOString().split('T')[0]
          }
        ],
        award_type_codes: ["A", "B", "C", "D"]
      },
      page: 1,
      limit: 10,
      sort: "obligated_amount",
      order: "desc"
    }

    console.log('Making request to USASpending.gov')
    const usaSpendingResponse = await fetch(USA_SPENDING_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usaSpendingBody)
    })

    let usaSpendingResults = []
    if (usaSpendingResponse.ok) {
      const usaSpendingData = await usaSpendingResponse.json()
      console.log('USASpending.gov results count:', usaSpendingData.results?.length || 0)
      
      usaSpendingResults = (usaSpendingData.results || []).map((award: any) => ({
        id: award.generated_internal_id || crypto.randomUUID(),
        title: award.recipient_name || 'Unnamed Award',
        description: award.description || '',
        funding_agency: award.awarding_agency_name || null,
        funding_amount: award.obligated_amount || null,
        status: award.status || 'unknown',
        source: 'USASpending.gov'
      }))
    } else {
      console.error('USASpending.gov API error:', usaSpendingResponse.status)
    }

    // Combine results
    const combinedResults = [...samResults, ...usaSpendingResults]
    console.log('Total combined results:', combinedResults.length)

    return new Response(
      JSON.stringify(combinedResults),
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