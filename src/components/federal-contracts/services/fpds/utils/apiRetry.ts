export interface ApiError extends Error {
  status?: number
  response?: Response
}

export function validateApiEndpoint(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function validateRequestParams(params: Record<string, any>): string[] {
  const errors: string[] = []
  
  if (params.size && (params.size < 1 || params.size > 100)) {
    errors.push('Size must be between 1 and 100')
  }
  
  if (params.start && params.start < 0) {
    errors.push('Start must be non-negative')
  }
  
  return errors
}

export async function parseErrorResponse(error: unknown): Promise<string> {
  if (error instanceof Error) {
    const apiError = error as ApiError
    if (apiError.response) {
      try {
        const errorText = await apiError.response.text()
        return errorText || apiError.message
      } catch {
        return apiError.message
      }
    }
    return error.message
  }
  return String(error)
}

export function getRateLimitDelay(): number {
  return Math.random() * 1000 + 500 // Random delay between 500-1500ms
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number
    initialDelay?: number
    maxDelay?: number
    retryableStatuses?: number[]
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    retryableStatuses = [429, 500, 502, 503, 504]
  } = options

  let attempt = 1
  let delay = initialDelay

  while (attempt <= maxAttempts) {
    try {
      return await fn()
    } catch (error) {
      const apiError = error as ApiError
      
      if (
        attempt === maxAttempts ||
        !apiError.status ||
        !retryableStatuses.includes(apiError.status)
      ) {
        throw error
      }

      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
      
      delay = Math.min(delay * 2, maxDelay)
      attempt++
    }
  }

  throw new Error('Max retry attempts reached')
}