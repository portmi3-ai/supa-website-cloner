import { SearchParams, FederalDataResult } from '../types.ts'
import { withRetry } from '../utils/apiRetry.ts'

const SAM_API_URL = "https://api.sam.gov/opportunities/v2/search"
const PAGE_SIZE = 25 // Reduced for better reliability

export async function fetchSAMData(params: SearchParams, apiKey: string): Promise<FederalDataResult[]> {
  console.log('Fetching SAM.gov data with params:', {
    hasSearchTerm: !!params.searchTerm,
    agency: params.agency,
    page: params.page || 0,
    timestamp: new Date().toISOString()
  })

  try {
    if (!apiKey) {
      console.error('SAM API key is missing')
      throw new Error('SAM API key is required')
    }

    const queryParams = new URLSearchParams()
    queryParams.append('api_key', apiKey)
    // Use postedFrom/postedTo for date filtering if provided
    if (params.startDate) {
      queryParams.append('postedFrom', new Date(params.startDate).toISOString().split('T')[0])
    }
    if (params.endDate) {
      queryParams.append('postedTo', new Date(params.endDate).toISOString().split('T')[0])
    }
    // Add keyword search
    if (params.searchTerm?.trim()) {
      queryParams.append('keywords', params.searchTerm.trim())
    }
    // Add agency filter
    if (params.agency && params.agency !== 'all') {
      queryParams.append('department', params.agency)
    }
    // Add pagination
    queryParams.append('page', (params.page || 0).toString())
    queryParams.append('size', PAGE_SIZE.toString())
    // Only active opportunities
    queryParams.append('active', 'true')

    const requestUrl = `${SAM_API_URL}?${queryParams}`
    console.log('Making SAM.gov API request:', {
      url: SAM_API_URL,
      params: Object.fromEntries(queryParams.entries()),
      timestamp: new Date().toISOString()
    })

    const response = await withRetry(
      async () => {
        const res = await fetch(requestUrl, {
          headers: {
            'Accept': 'application/json',
            'X-Api-Key': apiKey
          }
        })

        if (!res.ok) {
          const errorText = await res.text()
          console.error('SAM.gov API error:', {
            status: res.status,
            statusText: res.statusText,
            error: errorText,
            timestamp: new Date().toISOString()
          })
          throw new Error(`SAM.gov API error: ${res.status} ${res.statusText}\n${errorText}`)
        }

        return res
      },
      {
        maxAttempts: 3,
        initialDelay: 1000,
        maxDelay: 5000,
      }
    )

    const data = await response.json()
    console.log('SAM.gov response:', {
      opportunitiesCount: data.opportunitiesData?.length || 0,
      totalRecords: data.totalRecords || 0,
      timestamp: new Date().toISOString()
    })

    // Transform the data into our standard format
    return (data.opportunitiesData || []).map((opp: any) => ({
      id: opp.noticeId || crypto.randomUUID(),
      title: opp.title || 'Untitled Opportunity',
      description: opp.description || '',
      agency: opp.department || params.agency || null,
      type: opp.noticeType || 'Unknown',
      posted_date: opp.postedDate || null,
      value: opp.baseAndAllOptionsValue || null,
      response_due: opp.responseDeadLine || null,
      naics_code: opp.naicsCode || null,
      set_aside: opp.setAside || null,
      status: 'active'
    }))
  } catch (error) {
    console.error('SAM.gov fetch error:', error)
    // Return empty array instead of throwing to handle gracefully
    return []
  }
}