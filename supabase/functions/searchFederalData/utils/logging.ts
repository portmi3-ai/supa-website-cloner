export const logError = (context: string, error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  const errorStack = error instanceof Error ? error.stack : undefined
  
  console.error(`Error in ${context}:`, {
    message: errorMessage,
    stack: errorStack,
    timestamp: new Date().toISOString()
  })
}

export const logSearchParameters = (params: unknown) => {
  console.log('Search parameters:', {
    params,
    timestamp: new Date().toISOString()
  })
}

export const logSearchResponse = (response: unknown) => {
  console.log('Search response:', {
    response,
    timestamp: new Date().toISOString()
  })
}