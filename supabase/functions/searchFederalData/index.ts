import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { aggregateSearchResults } from './services/data-aggregator.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const {
      searchTerm,
      agency,
      startDate,
      endDate,
      noticeType,
      activeOnly,
      state,
      city,
      page = 0,
      limit = 100,
    } = await req.json()

    console.log('Received search request:', {
      searchTerm,
      agency,
      startDate,
      endDate,
      noticeType,
      activeOnly,
      state,
      city,
      page,
      limit,
    })

    const results = await aggregateSearchResults({
      searchTerm,
      agency,
      startDate,
      endDate,
      noticeType,
      activeOnly,
      state,
      city,
      page,
      limit,
    })

    return new Response(
      JSON.stringify(results),
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
        message: "Failed to fetch contract data. Please try again later."
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