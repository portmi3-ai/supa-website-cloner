import { SearchParams, FederalDataResult } from '../types.ts'
import { withRetry, parseErrorResponse, validateApiEndpoint, validateRequestParams, ApiError, getRateLimitDelay } from '../utils/apiRetry.ts'

const FPDS_API_URL = "https://www.fpds.gov/ezsearch/FEEDS/ATOM"

export async function fetchFPDSData(params: SearchParams): Promise<FederalDataResult[]> {
  console.log('FPDS Search params:', {
    searchTerm: params.searchTerm,
    agency: params.agency,
    startDate: params.startDate,
    endDate: params.endDate,
    page: params.page,
    timestamp: new Date().toISOString()
  })

  try {
    // Build query parameters
    const queryParams = new URLSearchParams()
    
    // Always use a search term, default to '*' if none provided
    const searchQuery = params.searchTerm?.trim() || '*'
    queryParams.append('q', searchQuery)
    
    // Add agency filter if specified
    if (params.agency && params.agency !== 'all') {
      queryParams.append('agency', params.agency)
    }
    
    // Add date range if specified
    if (params.startDate) {
      queryParams.append('fromDate', new Date(params.startDate).toISOString().split('T')[0])
    }
    if (params.endDate) {
      queryParams.append('toDate', new Date(params.endDate).toISOString().split('T')[0])
    }
    
    // Add pagination
    const offset = (params.page || 0) * 10
    queryParams.append('start', offset.toString())
    queryParams.append('size', '10')

    const requestUrl = `${FPDS_API_URL}?${queryParams}`
    console.log('FPDS API request URL:', requestUrl)

    const response = await withRetry(async () => {
      const res = await fetch(requestUrl)
      if (!res.ok) {
        throw new Error(`FPDS API error: ${res.status}`)
      }
      return res
    }, {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 5000,
    })

    const xmlText = await response.text()
    console.log('FPDS Raw response:', xmlText.substring(0, 500)) // Log first 500 chars of response

    // Extract contract data from XML
    const titleMatches = xmlText.match(/<title>(.*?)<\/title>/g) || []
    const descMatches = xmlText.match(/<summary.*?>(.*?)<\/summary>/g) || []
    const dateMatches = xmlText.match(/<updated>(.*?)<\/updated>/g) || []

    console.log('FPDS Matches found:', {
      titles: titleMatches.length,
      descriptions: descMatches.length,
      dates: dateMatches.length
    })

    // Transform matches into contract data
    const results: FederalDataResult[] = titleMatches.map((title, index) => ({
      id: crypto.randomUUID(),
      title: title.replace(/<\/?title>/g, '').trim(),
      description: descMatches[index] 
        ? descMatches[index].replace(/<summary.*?>(.*?)<\/summary>/g, '$1').trim()
        : '',
      agency: params.agency || 'Unknown',
      type: 'Contract',
      posted_date: dateMatches[index]
        ? dateMatches[index].replace(/<\/?updated>/g, '').trim()
        : new Date().toISOString(),
      value: 0,
      response_due: null,
      naics_code: null,
      set_aside: null
    }))

    console.log('FPDS Transformed results:', {
      count: results.length,
      firstResult: results[0] || null
    })

    return results
  } catch (error) {
    console.error('FPDS fetch error:', error)
    throw error
  }
}