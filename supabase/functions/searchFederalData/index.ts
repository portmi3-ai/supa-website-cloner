import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const SAM_API_URL = "https://api.sam.gov/entity-information/v3/entities"
const USA_SPENDING_API_URL = "https://api.usaspending.gov/api/v2/search/spending_by_award/"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { searchTerm, agency, startDate, endDate, noticeType, activeOnly } = await req.json()
    console.log('Searching federal data with params:', { searchTerm, agency, startDate, endDate, noticeType, activeOnly })

    const apiKey = Deno.env.get('SAM_API_KEY')
    if (!apiKey) {
      console.error('SAM API key is missing')
      throw new Error('SAM API configuration is incomplete')
    }

    // Build SAM.gov query parameters
    const samParams = new URLSearchParams({
      api_key: apiKey,
      q: searchTerm || '*',
      page: '0',
      size: '10',
    })

    // Add agency filter if specified
    if (agency && agency !== 'all') {
      samParams.append('organizationId', agency)
      console.log('Added agency filter:', agency)
    }

    // Add notice type filter if specified
    if (noticeType && noticeType !== 'all') {
      samParams.append('noticeType', noticeType)
      console.log('Added notice type filter:', noticeType)
    }

    // Add active only filter if specified
    if (activeOnly) {
      samParams.append('active', 'true')
      console.log('Added active only filter')
    }

    console.log('Making request to SAM.gov with params:', samParams.toString())
    const samResponse = await fetch(`${SAM_API_URL}?${samParams.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': apiKey,
        'apikey': apiKey  // Adding the apikey header as required by SAM.gov
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
      agency: entity.entityRegistration?.agencyBusinessPurposeCode || null,
      type: entity.entityRegistration?.businessTypes?.[0] || 'Unknown',
      posted_date: entity.entityRegistration?.registrationDate || null,
      naics_code: entity.entityRegistration?.primaryNaics || null,
      set_aside: entity.entityRegistration?.businessTypeList?.[0] || null,
      response_due: entity.entityRegistration?.registrationExpirationDate || null,
    }))

    // Fetch from USASpending.gov with date filters
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
        agency: award.awarding_agency_name || null,
        type: award.type || 'Unknown',
        posted_date: award.action_date || null,
        naics_code: award.naics_code || null,
        set_aside: null,
        response_due: null
      }))
    } else {
      console.error('USASpending.gov API error:', usaSpendingResponse.status)
    }

    // Combine and filter results based on active only if specified
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