import { SearchParams, FederalDataResult } from '../types.ts'
import { withRetry, parseErrorResponse, validateApiEndpoint, validateRequestParams, ApiError } from '../utils/apiRetry.ts'

const FPDS_API_URL = "https://www.fpds.gov/ezsearch/FEEDS/ATOM"
const CACHE_DURATION = 3600000 // 1 hour in milliseconds

interface CachedData {
  timestamp: number;
  data: FederalDataResult[];
}

export async function fetchFPDSData(params: SearchParams): Promise<FederalDataResult[]> {
  console.log('Fetching FPDS data with params:', {
    hasSearchTerm: !!params.searchTerm,
    agency: params.agency,
    timestamp: new Date().toISOString(),
  })

  // Validate API URL
  if (!validateApiEndpoint(FPDS_API_URL)) {
    console.error('Invalid FPDS API URL configuration')
    throw new Error('FPDS API configuration error')
  }

  try {
    // Build and validate query parameters
    const queryParams = new URLSearchParams()
    const searchQuery = params.searchTerm?.trim() || '*'
    queryParams.append('q', searchQuery)
    
    if (params.agency && params.agency !== 'all') {
      queryParams.append('agency', params.agency)
    }
    
    // Implement pagination with validated size
    const offset = (params.page || 0) * (params.limit || 50)
    const size = Math.min(params.limit || 50, 50) // Ensure size doesn't exceed 50
    queryParams.append('start', offset.toString())
    queryParams.append('size', size.toString())

    // Validate request parameters
    const paramErrors = validateRequestParams({
      q: searchQuery,
      start: offset,
      size: size,
    })
    
    if (paramErrors.length > 0) {
      throw new Error(`Invalid request parameters: ${paramErrors.join(', ')}`)
    }

    const requestUrl = `${FPDS_API_URL}?${queryParams}`
    console.log('Making FPDS API request:', {
      url: FPDS_API_URL,
      query: searchQuery,
      hasAgency: !!params.agency,
      requestUrl,
      offset,
      limit: size,
      timestamp: new Date().toISOString(),
    })
    
    const response = await withRetry(async () => {
      const res = await fetch(requestUrl)
      if (!res.ok) {
        const error = new Error(`FPDS API error: ${res.status}`) as ApiError
        error.status = res.status
        error.response = res
        throw error
      }
      return res
    }, {
      maxAttempts: 5,
      initialDelay: 1000,
      maxDelay: 10000,
      retryableStatuses: [429, 500, 502, 503, 504],
    })

    const xmlText = await response.text()
    const contractData = xmlText.match(/<title>(.*?)<\/title>/g) || []
    console.log('FPDS results count:', contractData.length)
    
    // Cache results if available
    if (contractData.length > 0) {
      try {
        const cacheData: CachedData = {
          timestamp: Date.now(),
          data: contractData.map(title => ({
            id: crypto.randomUUID(),
            title: title.replace(/<\/?title>/g, ''),
            description: '',
            funding_agency: params.agency || null,
            funding_amount: null,
            status: 'active',
            source: 'FPDS',
            contract_type: 'federal'
          }))
        }
        localStorage.setItem('fpds_cache', JSON.stringify(cacheData))
      } catch (cacheError) {
        console.warn('Failed to cache FPDS results:', cacheError)
      }
    }
    
    return contractData.map(title => ({
      id: crypto.randomUUID(),
      title: title.replace(/<\/?title>/g, ''),
      description: '',
      funding_agency: params.agency || null,
      funding_amount: null,
      status: 'active',
      source: 'FPDS',
      contract_type: 'federal'
    }))
  } catch (error) {
    console.error('FPDS fetch error:', error)
    
    // Try to get cached results if available
    try {
      const cachedDataStr = localStorage.getItem('fpds_cache')
      if (cachedDataStr) {
        const cachedData: CachedData = JSON.parse(cachedDataStr)
        const cacheAge = Date.now() - cachedData.timestamp
        
        // Use cache if less than cache duration old
        if (cacheAge < CACHE_DURATION) {
          console.log('Using cached FPDS results')
          return cachedData.data
        }
      }
    } catch (cacheError) {
      console.warn('Failed to retrieve cached FPDS results:', cacheError)
    }
    
    // If no cache or cache too old, parse error and throw
    const errorMessage = await parseErrorResponse(error)
    throw new Error(`FPDS API error: ${errorMessage}`)
  }
}