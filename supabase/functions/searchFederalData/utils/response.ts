import { corsHeaders } from '../cors.ts'
import { ApiError } from './apiRetry.ts'

export const createSuccessResponse = (data: any) => {
  return new Response(
    JSON.stringify(data),
    {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 200,
    }
  )
}

export const createErrorResponse = (error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  console.error('Error in searchFederalData:', {
    error: errorMessage,
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString()
  })

  const status = error instanceof ApiError ? error.status || 500 : 500
  const message = status === 400 ? 'Invalid search parameters. Please check your input and try again.' :
                 status === 401 ? 'Authentication failed. Please check your API key.' :
                 'Failed to fetch contract data. Please try again later.'

  return new Response(
    JSON.stringify({ 
      error: errorMessage,
      message,
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
      status: 200, // Always return 200 to prevent Supabase from retrying
    }
  )
}