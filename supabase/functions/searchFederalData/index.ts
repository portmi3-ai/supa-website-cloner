import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { aggregateSearchResults } from './services/data-aggregator.ts'
import { logSearchParameters, logSearchResponse } from './utils/logging.ts'
import { createSuccessResponse, createErrorResponse } from './utils/response.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Received search request')
    
    const params = await req.json()
    logSearchParameters(params)

    const results = await aggregateSearchResults(params)

    const response = {
      data: results || [],
      totalPages: Math.ceil((results?.length || 0) / (params.limit || 100)),
      currentPage: params.page || 0,
      totalRecords: results?.length || 0
    }

    logSearchResponse(response)
    return createSuccessResponse(response)
  } catch (error) {
    return createErrorResponse(error)
  }
})