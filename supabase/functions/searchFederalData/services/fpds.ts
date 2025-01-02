import { SearchParams, FederalDataResult } from '../types.ts'
import { withRetry, parseErrorResponse } from '../utils/apiRetry.ts'

const FPDS_API_URL = "https://www.fpds.gov/ezsearch/FEEDS/ATOM"

export async function fetchFPDSData(params: SearchParams): Promise<FederalDataResult[]> {
  console.log('Fetching FPDS data with params:', {
    hasSearchTerm: !!params.searchTerm,
    agency: params.agency,
  })

  // Validate required parameters
  if (!FPDS_API_URL) {
    console.error('FPDS API URL is not configured')
    throw new Error('FPDS API configuration error')
  }

  try {
    // Build query parameters
    const queryParams = new URLSearchParams()
    
    // Handle empty search query - use '*' as default
    const searchQuery = params.searchTerm?.trim() || '*'
    queryParams.append('q', searchQuery)

    // Add optional agency filter if provided
    if (params.agency && params.agency !== 'all') {
      queryParams.append('agency', params.agency)
    }

    // Add pagination parameters
    const offset = (params.page || 0) * (params.limit || 100)
    queryParams.append('start', offset.toString())
    queryParams.append('size', (params.limit || 100).toString())

    const requestUrl = `${FPDS_API_URL}?${queryParams}`
    console.log('Making FPDS API request:', {
      url: FPDS_API_URL,
      query: searchQuery,
      hasAgency: !!params.agency,
      requestUrl,
      offset,
      limit: params.limit,
    })
    
    const response = await withRetry(async () => {
      const res = await fetch(requestUrl)
      if (!res.ok) {
        const errorText = await res.text()
        console.error('FPDS API error:', {
          status: res.status,
          statusText: res.statusText,
          error: errorText,
          requestUrl,
        })
        throw new Error(`FPDS API error: ${res.status} ${errorText}`)
      }
      return res
    }, {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 5000,
    })

    const xmlText = await response.text()
    const contractData = xmlText.match(/<title>(.*?)<\/title>/g) || []
    console.log('FPDS results count:', contractData.length)
    
    // Cache results if available
    if (contractData.length > 0) {
      try {
        // Store in local cache (implement caching mechanism as needed)
        localStorage.setItem('fpds_cache', JSON.stringify({
          timestamp: Date.now(),
          data: contractData,
        }))
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
      const cachedData = localStorage.getItem('fpds_cache')
      if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData)
        const cacheAge = Date.now() - timestamp
        
        // Use cache if less than 1 hour old
        if (cacheAge < 3600000) {
          console.log('Using cached FPDS results')
          return data.map((title: string) => ({
            id: crypto.randomUUID(),
            title: title.replace(/<\/?title>/g, ''),
            description: '',
            funding_agency: params.agency || null,
            funding_amount: null,
            status: 'active',
            source: 'FPDS (cached)',
            contract_type: 'federal'
          }))
        }
      }
    } catch (cacheError) {
      console.warn('Failed to retrieve cached FPDS results:', cacheError)
    }
    
    // If no cache or cache too old, throw the original error
    const errorMessage = parseErrorResponse(error)
    throw new Error(`FPDS API error: ${errorMessage}`)
  }
}