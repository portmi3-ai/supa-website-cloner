export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 5000,
  }
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt === config.maxAttempts) {
        break;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        config.initialDelay * Math.pow(2, attempt - 1),
        config.maxDelay
      );
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error('Operation failed after all retry attempts');
}

export function parseErrorResponse(error: any): string {
  if (error.response?.text) {
    try {
      const htmlContent = error.response.text;
      // Extract error message from HTML if present
      const messageMatch = htmlContent.match(/<error>(.*?)<\/error>/);
      if (messageMatch) {
        return messageMatch[1];
      }
    } catch (parseError) {
      console.error('Error parsing error response:', parseError);
    }
  }
  
  return error.message || 'An unknown error occurred';
}