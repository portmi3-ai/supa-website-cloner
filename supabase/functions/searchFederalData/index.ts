import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { aggregateSearchResults } from './services/data-aggregator.ts'
import { logSearchParameters, logSearchResponse } from './utils/logging.ts'
import { createSuccessResponse, createErrorResponse } from './utils/response.ts'
import { withRetry } from './utils/apiRetry.ts'

serve(async (req) => {
  console.log('🔍 Search request received:', new Date().toISOString())
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('👋 Handling CORS preflight request')
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
      } 
    })
  }

  try {
    // Validate API key first
    const apiKey = Deno.env.get('SAM_API_KEY')
    if (!apiKey) {
      console.error('❌ SAM.gov API key is missing')
      throw new Error('SAM_API_KEY is not configured. Please set it in the Supabase Edge Function secrets.')
    } else {
      console.log('✅ SAM.gov API key is configured')
    }
    
    const params = await req.json()
    console.log('📥 Received search parameters:', {
      ...params,
      timestamp: new Date().toISOString()
    })

    // Validate and clean up search parameters
    const cleanParams = {
      searchTerm: params.searchTerm || '*',
      agency: params.agency,
      startDate: params.startDate,
      endDate: params.endDate,
      noticeType: params.noticeType,
      activeOnly: params.activeOnly ?? true,
      page: params.page || 0,
      limit: Math.min(params.limit || 10, 100),
      sortField: params.sortField,
      sortDirection: params.sortDirection
    }

    console.log('🧹 Cleaned search parameters:', {
      ...cleanParams,
      timestamp: new Date().toISOString()
    })

    // Wrap the aggregateSearchResults call with retry logic
    console.log('🔄 Starting search aggregation...')
    const results = await withRetry(
      () => aggregateSearchResults(cleanParams),
      {
        maxAttempts: 3,
        initialDelay: 1000,
        maxDelay: 5000,
        retryableStatuses: [429, 500, 502, 503, 504]
      }
    )

    console.log('✅ Search completed successfully:', {
      totalResults: results.data.length,
      totalRecords: results.totalRecords,
      currentPage: results.currentPage,
      totalPages: results.totalPages,
      timestamp: new Date().toISOString()
    })

    return createSuccessResponse(results)
  } catch (error) {
    console.error('❌ Search error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })

    // Enhanced error response with more specific messages
    const errorResponse = {
      error: error.message,
      message: error.message.includes('SAM_API_KEY') 
        ? 'The SAM.gov API key is not configured. Please check the Edge Function secrets.'
        : error.message.includes('429') 
          ? 'Rate limit exceeded. Please try again in a few moments.'
          : error.message.includes('401')
            ? 'Invalid API key. Please check your SAM.gov API key configuration.'
            : 'An error occurred while searching federal contracts. Please try again.',
      status: error.status || 500,
      timestamp: new Date().toISOString()
    }

    console.error('📤 Sending error response:', errorResponse)
    return createErrorResponse(error)
  }
})