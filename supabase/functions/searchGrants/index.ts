import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const GRANTS_API_URL = "https://api.grants.gov/grantsws/rest/opportunities/search/"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { searchTerm } = await req.json()
    
    // Build the grants.gov API query
    const params = new URLSearchParams({
      keyword: searchTerm || '',
      oppStatus: 'posted',
    })

    const response = await fetch(`${GRANTS_API_URL}?${params.toString()}`)
    const data = await response.json()

    // Transform the data to match our proposals structure
    const transformedGrants = data.oppHits.map((grant: any) => ({
      id: grant.id,
      title: grant.title,
      description: grant.description,
      funding_agency: grant.agency,
      funding_amount: grant.awardCeiling,
      submission_deadline: grant.closeDate,
      status: 'posted',
    }))

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