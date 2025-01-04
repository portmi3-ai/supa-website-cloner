import { corsHeaders } from '../../_shared/cors.ts'
import { ApiError } from './apiRetry.ts'

export const createSuccessResponse = (data: any) => {
  console.log('📤 Creating success response')
  return new Response(
    JSON.stringify(data),
    {
      headers: corsHeaders,
      status: 200,
    }
  )
}

export const createErrorResponse = (error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  console.error('❌ Creating error response:', {
    error: errorMessage,
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString()
  })

  const status = error instanceof ApiError ? error.status || 500 : 500
  const message = status === 400 ? 'Invalid search parameters. Please check your input and try again.' :
                 status === 401 ? 'Authentication failed. Please check your SAM.gov API key.' :
                 status === 429 ? 'Too many requests. Please try again in a few moments.' :
                 'Failed to fetch contract data. Please try again later.'

  return new Response(
    JSON.stringify({ 
      error: errorMessage,
      message,
      data: [],
      totalPages: 0,
      currentPage: 0,
      totalRecords: 0,
      timestamp: new Date().toISOString()
    }),
    {
      headers: corsHeaders,
      status: 200, // Always return 200 to prevent Supabase from retrying
    }
  )
}