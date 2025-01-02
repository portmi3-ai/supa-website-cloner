interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  retryableStatuses?: number[];
}

export interface ApiError extends Error {
  status?: number;
  response?: Response;
  htmlContent?: string;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = {
    maxAttempts: 5,
    initialDelay: 1000,
    maxDelay: 10000,
    retryableStatuses: [429, 500, 502, 503, 504],
  }
): Promise<T> {
  let lastError: ApiError | null = null;
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      // Add delay between attempts (except for first attempt)
      if (attempt > 1) {
        const delay = Math.min(
          config.initialDelay * Math.pow(2, attempt - 1) + Math.random() * 1000,
          config.maxDelay
        );
        console.log(`Retry attempt ${attempt}, waiting ${delay}ms before retry`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      return await operation();
    } catch (error) {
      lastError = error as ApiError;
      console.error(`Attempt ${attempt} failed:`, {
        error,
        timestamp: new Date().toISOString(),
        attempt,
      });

      // Check if we should retry based on error status
      const shouldRetry = config.retryableStatuses?.includes(lastError.status || 0);
      
      if (!shouldRetry || attempt === config.maxAttempts) {
        break;
      }
    }
  }
  
  throw lastError || new Error('Operation failed after all retry attempts');
}

export async function parseErrorResponse(error: any): Promise<string> {
  try {
    if (error.response) {
      const response = error.response;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('text/html')) {
        const htmlContent = await response.text();
        // Extract error message from HTML if present
        const messageMatch = htmlContent.match(/<error>(.*?)<\/error>/) || 
                           htmlContent.match(/<message>(.*?)<\/message>/) ||
                           htmlContent.match(/<title>(.*?)<\/title>/);
        if (messageMatch) {
          return messageMatch[1];
        }
        // Store HTML content for debugging
        error.htmlContent = htmlContent;
      } else if (contentType?.includes('application/json')) {
        const jsonData = await response.json();
        if (jsonData.error || jsonData.message) {
          return jsonData.error || jsonData.message;
        }
      }
    }
  } catch (parseError) {
    console.error('Error parsing error response:', parseError);
  }
  
  return error.message || 'An unknown error occurred';
}

export function validateApiEndpoint(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateRequestParams(params: Record<string, any>): string[] {
  const errors: string[] = [];
  
  // Validate required parameters
  const requiredParams = ['q', 'start', 'size'];
  for (const param of requiredParams) {
    if (params[param] === undefined || params[param] === null) {
      errors.push(`Missing required parameter: ${param}`);
    }
  }
  
  // Validate parameter types and ranges
  if (params.size && (params.size < 1 || params.size > 50)) {
    errors.push('Size parameter must be between 1 and 50');
  }
  
  if (params.start && params.start < 0) {
    errors.push('Start parameter must be non-negative');
  }
  
  return errors;
}