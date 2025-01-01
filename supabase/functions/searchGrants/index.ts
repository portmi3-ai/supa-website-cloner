import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GRANTS_API_URL = "https://api.grants.gov/grantsws/rest/opportunities/search/"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { searchTerm } = await req.json()
    console.log('Searching grants with term:', searchTerm)
    
    // Build the grants.gov API query with enhanced parameters
    const params = new URLSearchParams({
      keyword: searchTerm || '',
      oppStatus: 'posted',
      sortBy: 'relevance',
      rows: '25', // Number of results per page
    })

    console.log('Fetching from URL:', `${GRANTS_API_URL}?${params.toString()}`)
    
    const response = await fetch(`${GRANTS_API_URL}?${params.toString()}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      console.error('Grants.gov API error:', response.status, response.statusText)
      throw new Error(`Grants.gov API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Grants.gov API response status:', data?.statusMessage || 'No status')
    console.log('Number of opportunities found:', data?.oppHits?.length || 0)

    // Check if we have valid data structure
    if (!data || !Array.isArray(data.oppHits)) {
      console.log('No grants found or invalid response structure')
      return new Response(
        JSON.stringify([]),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Transform the data to match our proposals structure with better parsing
    const transformedGrants = data.oppHits.map((grant: any) => {
      // Parse the award ceiling to a number if possible
      let awardCeiling = null
      if (grant.awardCeiling) {
        const parsed = parseFloat(grant.awardCeiling)
        if (!isNaN(parsed)) {
          awardCeiling = parsed
        }
      }

      // Parse the close date to ensure it's in the correct format
      let closeDate = null
      if (grant.closeDate) {
        try {
          closeDate = new Date(grant.closeDate).toISOString()
        } catch (e) {
          console.warn('Failed to parse close date:', grant.closeDate)
        }
      }

      return {
        id: grant.id || crypto.randomUUID(),
        title: grant.title || 'Untitled Grant',
        description: grant.description || grant.synopsis || '',
        funding_agency: grant.agency || grant.agencyName || 'Unknown Agency',
        funding_amount: awardCeiling,
        submission_deadline: closeDate,
        status: 'posted',
        // Additional fields that might be useful
        opportunity_number: grant.opportunityNumber || null,
        category: grant.categoryOfFunding || null,
        eligibility: grant.eligibleApplicants || null,
        posted_date: grant.postDate ? new Date(grant.postDate).toISOString() : null,
      }
    })

    console.log(`Successfully transformed ${transformedGrants.length} grants`)

    return new Response(
      JSON.stringify(transformedGrants),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error in searchGrants function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "Failed to fetch grants. Please try again later."
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