import { SearchParams, FederalDataResult } from '../types.ts'
import { withRetry, parseErrorResponse, validateApiEndpoint, validateRequestParams, ApiError, getRateLimitDelay } from '../utils/apiRetry.ts'

const FPDS_API_URL = "https://api.sam.gov/prod/opportunities/v2/search" // Updated to use SAM.gov API

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
    const apiKey = Deno.env.get('SAM_API_KEY')
    if (!apiKey) {
      console.error('SAM API key is missing')
      throw new Error('SAM API key configuration error')
    }

    // Build query parameters for SAM.gov API
    const queryParams = new URLSearchParams()
    const searchQuery = params.searchTerm?.trim() || '*'
    queryParams.append('keywords', searchQuery)
    
    if (params.agency && params.agency !== 'all') {
      queryParams.append('department', params.agency)
    }
    
    if (params.startDate) {
      queryParams.append('postedFrom', new Date(params.startDate).toISOString().split('T')[0])
    }
    if (params.endDate) {
      queryParams.append('postedTo', new Date(params.endDate).toISOString().split('T')[0])
    }
    
    // Add pagination
    const offset = (params.page || 0) * 100
    queryParams.append('limit', '100')
    queryParams.append('offset', offset.toString())

    const paramErrors = validateRequestParams({
      keywords: searchQuery,
      offset,
      limit: 100,
    })
    
    if (paramErrors.length > 0) {
      throw new Error(`Invalid request parameters: ${paramErrors.join(', ')}`)
    }

    const requestUrl = `${FPDS_API_URL}?${queryParams}`
    console.log('SAM.gov API request URL:', requestUrl)

    // Log the full request details
    console.log('SAM.gov API request details:', {
      url: requestUrl,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'ContractSearchApp/1.0'
      },
      timestamp: new Date().toISOString()
    })

    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, getRateLimitDelay()))
    
    const response = await withRetry(async () => {
      const res = await fetch(requestUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'ContractSearchApp/1.0'
        }
      })
      
      console.log('SAM.gov API response status:', {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        timestamp: new Date().toISOString()
      })

      if (!res.ok) {
        console.error('SAM.gov API error response:', {
          status: res.status,
          statusText: res.statusText,
          headers: Object.fromEntries(res.headers.entries())
        })
        const error = new Error(`SAM.gov API error: ${res.status}`) as ApiError
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

    const data = await response.json()
    console.log('SAM.gov API response data:', {
      totalRecords: data.totalRecords,
      hasData: !!data.opportunitiesData,
      firstResult: data.opportunitiesData?.[0]?.title,
      timestamp: new Date().toISOString()
    })

    if (!data.opportunitiesData) {
      console.warn('No opportunities data in response')
      return []
    }

    // Transform opportunities data into contract format
    const results: FederalDataResult[] = data.opportunitiesData.map((opp: any) => ({
      id: opp.noticeId || crypto.randomUUID(),
      title: opp.title || 'Untitled Opportunity',
      description: opp.description || '',
      agency: opp.department || params.agency || 'Unknown',
      type: opp.noticeType || 'Contract',
      posted_date: opp.postedDate || new Date().toISOString(),
      value: opp.baseAndAllOptionsValue || 0,
      response_due: opp.responseDeadLine || null,
      naics_code: opp.naicsCode || null,
      set_aside: opp.setAside || null
    }))

    console.log('SAM.gov Final results:', {
      count: results.length,
      firstResult: results[0] ? {
        id: results[0].id,
        title: results[0].title.substring(0, 50) + '...'
      } : null,
      timestamp: new Date().toISOString()
    })

    return results
  } catch (error) {
    console.error('SAM.gov fetch error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}