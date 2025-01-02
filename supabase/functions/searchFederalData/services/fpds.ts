import { SearchParams, FederalDataResult } from '../types.ts'
import { withRetry } from '../utils/apiRetry.ts'

const SAM_API_URL = "https://api.sam.gov/opportunities/v2/search"

export async function fetchFPDSData(params: SearchParams): Promise<FederalDataResult[]> {
  console.log('SAM.gov Search params:', {
    searchTerm: params.searchTerm,
    agency: params.agency,
    startDate: params.startDate,
    endDate: params.endDate,
    page: params.page,
    timestamp: new Date().toISOString()
  })

  try {
    const apiKey = Deno.env.get('SAM_API_KEY')
    if (!apiKey) {
      console.error('SAM API key is missing')
      throw new Error('SAM API key configuration error')
    }

    console.log('SAM API key verification:', {
      keyExists: !!apiKey,
      keyLength: apiKey.length,
      keyPrefix: apiKey.substring(0, 4) + '...',
      timestamp: new Date().toISOString()
    })

    // Build query parameters for SAM.gov API
    const queryParams = new URLSearchParams()
    
    // Add keyword search - ensure we're not sending empty strings
    const searchQuery = params.searchTerm?.trim() || '*'
    if (searchQuery !== '*') {
      queryParams.append('keywords', searchQuery)
    }
    
    // Add agency filter if specified
    if (params.agency && params.agency !== 'all') {
      queryParams.append('department', params.agency)
    }
    
    // Add date filters if specified
    if (params.startDate) {
      queryParams.append('postedFrom', new Date(params.startDate).toISOString().split('T')[0])
    }
    if (params.endDate) {
      queryParams.append('postedTo', new Date(params.endDate).toISOString().split('T')[0])
    }
    
    // Add pagination - ensure we're getting a good amount of results
    const offset = (params.page || 0) * 100
    queryParams.append('limit', '100')
    queryParams.append('offset', offset.toString())

    // Add sorting
    queryParams.append('sortBy', 'relevance')
    queryParams.append('order', 'desc')

    const requestUrl = `${SAM_API_URL}?${queryParams}`
    console.log('SAM.gov API request URL:', requestUrl)

    // Log request details
    console.log('SAM.gov API request details:', {
      url: requestUrl,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey.substring(0, 4)}...`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'ContractSearchApp/1.0'
      },
      params: Object.fromEntries(queryParams.entries()),
      timestamp: new Date().toISOString()
    })

    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000))
    
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
        const errorText = await res.text()
        console.error('SAM.gov API error response:', {
          status: res.status,
          statusText: res.statusText,
          error: errorText,
          headers: Object.fromEntries(res.headers.entries())
        })
        throw new Error(`SAM.gov API error: ${res.status} - ${errorText}`)
      }

      return res
    }, {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 5000,
      retryableStatuses: [429, 500, 502, 503, 504]
    })

    const rawData = await response.text()
    console.log('SAM.gov API raw response:', rawData.substring(0, 500) + '...')

    const data = JSON.parse(rawData)
    console.log('SAM.gov API parsed response:', {
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