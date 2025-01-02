import { FPDSSearchParams, FPDSContractData } from './types'
import { withRetry, parseErrorResponse, validateApiEndpoint, validateRequestParams, ApiError, getRateLimitDelay } from './utils/apiRetry'
import { getCachedResults, setCachedResults } from './cache'

const FPDS_API_URL = "https://www.fpds.gov/ezsearch/FEEDS/ATOM"

export async function fetchFPDSData(params: FPDSSearchParams): Promise<FPDSContractData[]> {
  console.log('Fetching FPDS data with params:', {
    hasSearchTerm: !!params.searchTerm,
    agency: params.agency,
    timestamp: new Date().toISOString(),
  })

  if (!validateApiEndpoint(FPDS_API_URL)) {
    console.error('Invalid FPDS API URL configuration')
    throw new Error('FPDS API configuration error')
  }

  try {
    const queryParams = new URLSearchParams()
    const searchQuery = params.searchTerm?.trim() || '*'
    queryParams.append('q', searchQuery)
    
    if (params.agency && params.agency !== 'all') {
      queryParams.append('agency', params.agency)
    }
    
    const offset = (params.page || 0) * (params.limit || 50)
    const size = Math.min(params.limit || 50, 50)
    queryParams.append('start', offset.toString())
    queryParams.append('size', size.toString())

    const paramErrors = validateRequestParams({
      q: searchQuery,
      start: offset,
      size: size,
    })
    
    if (paramErrors.length > 0) {
      throw new Error(`Invalid request parameters: ${paramErrors.join(', ')}`)
    }

    const requestUrl = `${FPDS_API_URL}?${queryParams}`
    
    await new Promise(resolve => setTimeout(resolve, getRateLimitDelay()))
    
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
    const matches = xmlText.match(/<title>(.*?)<\/title>/g)
    const contractData = matches || []
    
    const results = contractData.map(title => ({
      id: crypto.randomUUID(),
      title: title.replace(/<\/?title>/g, ''),
      description: '',
      funding_agency: params.agency || null,
      funding_amount: null,
      status: 'active',
      source: 'FPDS',
      contract_type: 'federal'
    }))

    if (results.length > 0) {
      setCachedResults(results)
    }
    
    return results
  } catch (error) {
    console.error('FPDS fetch error:', error)
    
    const cachedResults = getCachedResults()
    if (cachedResults) {
      return cachedResults
    }
    
    const errorMessage = await parseErrorResponse(error)
    throw new Error(`FPDS API error: ${errorMessage}`)
  }
}