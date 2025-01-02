import { corsHeaders } from '../_shared/cors.ts'

export const createSuccessResponse = (data: any) => {
  return new Response(
    JSON.stringify(data),
    {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  )
}

export const createErrorResponse = (error: unknown) => {
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