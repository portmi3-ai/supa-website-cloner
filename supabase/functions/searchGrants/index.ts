import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const GRANTS_API_URL = "https://api.grants.gov/grantsws/rest/opportunities/search/"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { searchTerm } = await req.json()
    console.log('Searching grants with term:', searchTerm)
    
    // Build the grants.gov API query
    const params = new URLSearchParams({
      keyword: searchTerm || '',
      oppStatus: 'posted',
    })

    const response = await fetch(`${GRANTS_API_URL}?${params.toString()}`)
    
    if (!response.ok) {
      console.error('Grants.gov API error:', response.status, response.statusText)
      throw new Error(`Grants.gov API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Grants.gov API response:', JSON.stringify(data))

    // Check if we have valid data structure
    if (!data || !data.oppHits) {
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

    // Transform the data to match our proposals structure
    const transformedGrants = data.oppHits.map((grant: any) => ({
      id: grant.id || crypto.randomUUID(),
      title: grant.title || 'Untitled Grant',
      description: grant.description || '',
      funding_agency: grant.agency || 'Unknown Agency',
      funding_amount: grant.awardCeiling || null,
      submission_deadline: grant.closeDate || null,
      status: 'posted',
    }))

    console.log(`Transformed ${transformedGrants.length} grants`)

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
      JSON.stringify({ error: error.message }),
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