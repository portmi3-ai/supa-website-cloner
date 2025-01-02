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
      timestamp: new Date().toISOString()
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

    // Ensure we always return a properly formatted response
    const response = {
      data: results || [],
      totalPages: Math.ceil((results?.length || 0) / (limit || 100)),
      currentPage: page || 0,
      totalRecords: results?.length || 0
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error in searchFederalData function:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })

    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: "Failed to fetch contract data. Please try again later.",
        data: [],
        totalPages: 0,
        currentPage: 0,
        totalRecords: 0
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