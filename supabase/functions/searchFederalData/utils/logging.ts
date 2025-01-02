export const logSearchParameters = (params: Record<string, any>) => {
  console.log('Search parameters:', {
    ...params,
    timestamp: new Date().toISOString()
  })
}

export const logSearchResponse = (response: { 
  totalRecords: number, 
  currentPage: number, 
  totalPages: number 
}) => {
  console.log('Search response:', {
    ...response,
    timestamp: new Date().toISOString()
  })
}

export const logError = (context: string, error: unknown) => {
  console.error(`Error in ${context}:`, {
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString()
  })
}