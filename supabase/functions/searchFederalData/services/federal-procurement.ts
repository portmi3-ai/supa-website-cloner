import { FederalDataResult, SearchParams } from '../types.ts'
import { withRetry, ApiError } from '../utils/apiRetry.ts'
import { corsHeaders } from '../cors.ts'

const BASE_URL = 'https://api.sam.gov/opportunities/v2/search'

// Validate date format (mm/dd/yyyy)
function isValidDateFormat(dateString: string): boolean {
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/
  return regex.test(dateString)
}

// Format date to mm/dd/yyyy
function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}

export async function searchFederalOpportunities(params: SearchParams): Promise<{
  results: FederalDataResult[],
  totalRecords: number,
  currentPage: number,
  totalPages: number
}> {
  try {
    console.log('Fetching federal opportunities with params:', {
      ...params,
      timestamp: new Date().toISOString()
    })
    
    const apiKey = Deno.env.get("SAM_API_KEY")
    if (!apiKey) {
      console.error('SAM.gov API key configuration error')
      throw new Error('SAM_API_KEY is not configured')
    }

    // Build query parameters with proper formatting
    const queryParams = new URLSearchParams()
    
    // Add required parameters
    queryParams.append('api_key', apiKey)
    
    // Handle dates
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)
    
    const postedFrom = params.startDate ? new Date(params.startDate) : thirtyDaysAgo
    const postedTo = params.endDate ? new Date(params.endDate) : today
    
    queryParams.append('postedFrom', formatDate(postedFrom))
    queryParams.append('postedTo', formatDate(postedTo))
    
    // Handle pagination - SAM.gov uses offset-based pagination
    const limit = Math.min(params.limit || 10, 100) // Cap at 100 results per page
    const offset = ((params.page || 0) * limit)
    queryParams.append('limit', String(limit))
    queryParams.append('offset', String(offset))

    // Add optional parameters if they exist
    if (params.searchTerm && params.searchTerm !== '*') {
      queryParams.append('title', params.searchTerm)
    }
    
    if (params.agency && params.agency !== 'all') {
      queryParams.append('deptname', params.agency)
    }

    if (params.noticeType && params.noticeType !== 'all') {
      queryParams.append('ptype', params.noticeType)
    }

    const requestUrl = `${BASE_URL}?${queryParams.toString()}`
    console.log('Making SAM.gov API request:', {
      url: requestUrl.replace(apiKey, '[REDACTED]'),
      params: {
        ...Object.fromEntries(queryParams.entries()),
        api_key: '[REDACTED]'
      },
      timestamp: new Date().toISOString()
    })

    const response = await withRetry(async () => {
      const res = await fetch(requestUrl, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('SAM API Error:', {
          status: res.status,
          statusText: res.statusText,
          error: errorText,
          headers: Object.fromEntries(res.headers.entries()),
          timestamp: new Date().toISOString()
        })
        
        if (res.status === 401) {
          throw new ApiError('Invalid API key or unauthorized access', res.status)
        } else if (res.status === 400) {
          throw new ApiError('Invalid request parameters', res.status)
        }
        
        throw new ApiError(`SAM API Error: ${res.status} ${res.statusText}`, res.status)
      }

      const data = await res.json()
      console.log('SAM API Response structure:', {
        hasOpportunitiesData: !!data.opportunitiesData,
        totalRecords: data.totalRecords,
        timestamp: new Date().toISOString()
      })

      if (!data || !data.opportunitiesData) {
        console.error('Invalid API response format:', {
          data,
          timestamp: new Date().toISOString()
        })
        throw new Error('Invalid API response format')
      }

      return data
    }, {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 5000,
      retryableStatuses: [429, 500, 502, 503, 504]
    })

    console.log('SAM API Response:', {
      totalRecords: response.totalRecords,
      currentPage: params.page,
      limit: params.limit,
      timestamp: new Date().toISOString()
    })

    if (!response.opportunitiesData || response.opportunitiesData.length === 0) {
      console.log('No results found for the given search criteria')
      return {
        results: [],
        totalRecords: 0,
        currentPage: params.page || 0,
        totalPages: 0
      }
    }

    const transformedData = response.opportunitiesData.map((item: any) => ({
      id: item.noticeId,
      title: item.title,
      agency: item.department,
      type: item.type,
      posted_date: item.postedDate,
      value: item.baseAndAllOptionsValue,
      response_due: item.responseDeadLine,
      naics_code: item.naicsCode,
      set_aside: item.setAside?.[0]?.type || null,
      source: 'sam.gov'
    }))

    const totalPages = Math.ceil(response.totalRecords / limit)

    console.log(`Transformed ${transformedData.length} results successfully. Total pages: ${totalPages}`)
    return {
      results: transformedData,
      totalRecords: response.totalRecords,
      currentPage: params.page || 0,
      totalPages
    }
  } catch (error) {
    console.error('Error in searchFederalOpportunities:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}