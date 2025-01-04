import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { aggregateSearchResults } from './services/data-aggregator.ts'
import { logSearchParameters, logSearchResponse } from './utils/logging.ts'
import { createSuccessResponse, createErrorResponse } from './utils/response.ts'
import { withRetry } from './utils/apiRetry.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
      } 
    })
  }

  try {
    console.log('Received search request')
    
    const params = await req.json()
    logSearchParameters(params)

    // Validate API key
    const apiKey = Deno.env.get('SAM_API_KEY')
    if (!apiKey) {
      console.error('SAM.gov API key is missing')
      throw new Error('SAM.gov API key is required')
    }

    // Validate and clean up search parameters
    const cleanParams = {
      searchTerm: params.searchTerm || '*',
      agency: params.agency,
      startDate: params.startDate,
      endDate: params.endDate,
      noticeType: params.noticeType,
      activeOnly: params.activeOnly ?? true,
      page: params.page || 0,
      limit: Math.min(params.limit || 10, 100), // Cap at 100 results per page
      sortField: params.sortField,
      sortDirection: params.sortDirection
    }

    console.log('Cleaned search parameters:', cleanParams)

    // Wrap the aggregateSearchResults call with retry logic
    const results = await withRetry(
      () => aggregateSearchResults(cleanParams),
      {
        maxAttempts: 3,
        initialDelay: 1000,
        maxDelay: 5000,
        retryableStatuses: [429, 500, 502, 503, 504]
      }
    )

    logSearchResponse(results)
    return createSuccessResponse(results)
  } catch (error) {
    console.error('Search error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
    return createErrorResponse(error)
  }
})