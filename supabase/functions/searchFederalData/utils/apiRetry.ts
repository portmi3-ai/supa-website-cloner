interface RetryConfig {
  maxAttempts: number
  initialDelay: number
  maxDelay: number
  retryableStatuses?: number[]
}

export class ApiError extends Error {
  status?: number
  
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 5000,
    retryableStatuses: [429, 500, 502, 503, 504],
  }
): Promise<T> {
  let lastError: ApiError | null = null
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      if (attempt > 1) {
        const delay = Math.min(
          config.initialDelay * Math.pow(2, attempt - 1),
          config.maxDelay
        )
        console.log(`Retry attempt ${attempt}, waiting ${delay}ms`, {
          timestamp: new Date().toISOString()
        })
        await new Promise(resolve => setTimeout(resolve, delay))
      }

      return await operation()
    } catch (error) {
      lastError = error instanceof ApiError ? error : new ApiError(String(error))
      console.error(`Attempt ${attempt} failed:`, {
        error: lastError.message,
        status: lastError.status,
        attempt,
        timestamp: new Date().toISOString()
      })

      const shouldRetry = config.retryableStatuses?.includes(lastError.status || 0)
      if (!shouldRetry || attempt === config.maxAttempts) {
        break
      }
    }
  }
  
  throw lastError || new Error('Operation failed after all retry attempts')
}