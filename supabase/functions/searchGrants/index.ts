import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const GRANTS_API_URL = "https://www.grants.gov/grantsws/rest/opportunities/search/"

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

    const url = `${GRANTS_API_URL}?${params.toString()}`
    console.log('Fetching from Grants.gov URL:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Grants.gov API Client',
      },
    })
    
    if (!response.ok) {
      console.error('Grants.gov API error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('Error details:', errorText)
      throw new Error(`Grants.gov API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Grants.gov API response:', {
      status: data?.statusMessage,
      count: data?.oppHits?.length || 0
    })

    const transformedGrants = (data.oppHits || []).map((grant: any) => ({
      id: grant.id || crypto.randomUUID(),
      title: grant.title || 'Untitled Grant',
      description: grant.description || grant.synopsis || '',
      funding_agency: grant.agency || grant.agencyName || 'Unknown Agency',
      funding_amount: grant.awardCeiling ? parseFloat(grant.awardCeiling) : null,
      submission_deadline: grant.closeDate ? new Date(grant.closeDate).toISOString() : null,
      status: 'posted',
      source: 'Grants.gov'
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