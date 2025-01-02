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

    // Validate and clean up search parameters
    const cleanParams = {
      searchTerm: params.searchTerm || '*', // Use '*' as default if not provided
      agency: params.agency,
      startDate: params.startDate,
      endDate: params.endDate,
      noticeType: params.noticeType,
      activeOnly: params.activeOnly ?? true,
      page: params.page || 0,
      limit: Math.min(params.limit || 50, 100), // Cap at 100 results per page
    }

    console.log('Cleaned search parameters:', cleanParams)

    const results = await aggregateSearchResults(cleanParams)

    const response = {
      data: results || [],
      totalPages: Math.ceil((results?.length || 0) / (cleanParams.limit || 50)),
      currentPage: cleanParams.page,
      totalRecords: results?.length || 0
    }

    logSearchResponse(response)
    return createSuccessResponse(response)
  } catch (error) {
    console.error('Search error:', error)
    return createErrorResponse(error)
  }
})