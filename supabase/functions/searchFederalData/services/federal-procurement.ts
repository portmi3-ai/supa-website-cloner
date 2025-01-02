import { FederalDataResult, SearchParams } from '../types.ts'
import { withRetry, ApiError } from '../utils/apiRetry.ts'
import { corsHeaders } from '../cors.ts'

const BASE_URL = 'https://api.sam.gov/opportunities/v2/search'

export async function searchFederalOpportunities(params: SearchParams): Promise<FederalDataResult[]> {
  try {
    console.log('Fetching federal opportunities with params:', params)
    
    const apiKey = Deno.env.get("SAM_API_KEY")
    if (!apiKey) {
      throw new Error('SAM_API_KEY is not configured')
    }

    // Format dates for the API
    const today = new Date()
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30))
    
    const queryParams = new URLSearchParams({
      api_key: apiKey,
      postedFrom: params.startDate || thirtyDaysAgo.toISOString().split('T')[0],
      postedTo: params.endDate || new Date().toISOString().split('T')[0],
      limit: String(params.limit || 100),
      offset: String((params.page || 0) * (params.limit || 100)),
      ...(params.searchTerm && params.searchTerm !== '*' && { keywords: params.searchTerm }),
      ...(params.agency && { department: params.agency }),
    })

    const response = await withRetry(async () => {
      const res = await fetch(`${BASE_URL}?${queryParams.toString()}`, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('SAM API Error:', {
          status: res.status,
          statusText: res.statusText,
          error: errorText,
        })
        throw new ApiError(`SAM API Error: ${res.status} ${res.statusText}`, res.status)
      }

      return res.json()
    })

    console.log('SAM API Response:', {
      totalRecords: response.totalRecords,
      currentPage: params.page,
      limit: params.limit,
    })

    return response.opportunitiesData.map((item: any) => ({
      id: item.noticeId,
      title: item.title,
      agency: item.department,
      type: item.type,
      posted_date: item.postedDate,
      value: item.baseAndAllOptionsValue,
      response_due: item.responseDeadLine,
      naics_code: item.naicsCode,
      set_aside: item.setAside?.[0]?.type || null,
    }))
  } catch (error) {
    console.error('Error in searchFederalOpportunities:', error)
    throw error
  }
}