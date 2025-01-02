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

  if (!validateApiEndpoint(FPDS_API_URL)) {
    console.error('Invalid FPDS API URL configuration')
    throw new Error('FPDS API configuration error')
  }

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
    const offset = (params.page || 0) * 100
    queryParams.append('start', offset.toString())
    queryParams.append('size', '100')

    const paramErrors = validateRequestParams({
      q: searchQuery,
      start: offset,
      size: 100,
    })
    
    if (paramErrors.length > 0) {
      throw new Error(`Invalid request parameters: ${paramErrors.join(', ')}`)
    }

    const requestUrl = `${FPDS_API_URL}?${queryParams}`
    console.log('FPDS API request URL:', requestUrl)

    // Log the full request details
    console.log('FPDS API request details:', {
      url: requestUrl,
      method: 'GET',
      headers: {
        'Accept': 'application/xml',
        'User-Agent': 'ContractSearchApp/1.0'
      },
      timestamp: new Date().toISOString()
    })

    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, getRateLimitDelay()))
    
    const response = await withRetry(async () => {
      const res = await fetch(requestUrl, {
        headers: {
          'Accept': 'application/xml',
          'User-Agent': 'ContractSearchApp/1.0'
        }
      })
      
      console.log('FPDS API response status:', {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        timestamp: new Date().toISOString()
      })

      if (!res.ok) {
        console.error('FPDS API error response:', {
          status: res.status,
          statusText: res.statusText,
          headers: Object.fromEntries(res.headers.entries())
        })
        const error = new Error(`FPDS API error: ${res.status}`) as ApiError
        error.status = res.status
        error.response = res
        throw error
      }
      return res
    }, {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 5000,
      retryableStatuses: [429, 500, 502, 503, 504]
    })

    const xmlText = await response.text()
    console.log('FPDS Raw XML response:', {
      length: xmlText.length,
      firstChars: xmlText.substring(0, 500),
      containsData: xmlText.includes('<entry>'),
      containsError: xmlText.includes('<error>'),
      containsTitle: xmlText.includes('<title>'),
      timestamp: new Date().toISOString()
    })

    // Try to extract error message if present
    const errorMatch = xmlText.match(/<error>(.*?)<\/error>/) || xmlText.match(/<message>(.*?)<\/message>/)
    if (errorMatch) {
      console.error('FPDS API returned error in XML:', errorMatch[1])
      throw new Error(`FPDS API error: ${errorMatch[1]}`)
    }

    // Extract contract data from XML
    const entries = xmlText.match(/<entry>(.*?)<\/entry>/gs) || []
    const titleMatches = xmlText.match(/<title>(.*?)<\/title>/g) || []
    const descMatches = xmlText.match(/<summary.*?>(.*?)<\/summary>/g) || []
    const dateMatches = xmlText.match(/<updated>(.*?)<\/updated>/g) || []

    console.log('FPDS XML parsing results:', {
      entries: entries.length,
      titleMatches: titleMatches.length,
      descMatches: descMatches.length,
      dateMatches: dateMatches.length,
      firstTitle: titleMatches[0]?.replace(/<\/?title>/g, '').trim(),
      timestamp: new Date().toISOString()
    })

    // Transform matches into contract data
    const results: FederalDataResult[] = titleMatches.map((title, index) => {
      const contractData = {
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
      }

      console.log('FPDS Transformed contract:', {
        id: contractData.id,
        title: contractData.title.substring(0, 50) + '...',
        timestamp: new Date().toISOString()
      })

      return contractData
    })

    console.log('FPDS Final results:', {
      count: results.length,
      firstResult: results[0] ? {
        id: results[0].id,
        title: results[0].title.substring(0, 50) + '...'
      } : null,
      timestamp: new Date().toISOString()
    })

    return results
  } catch (error) {
    console.error('FPDS fetch error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}