import { SearchParams, FederalDataResult } from '../types.ts'
import { withRetry } from '../utils/apiRetry.ts'

const SAM_API_URL = "https://api.sam.gov/opportunities/v2/search"

export async function fetchSAMData(params: SearchParams, apiKey: string): Promise<FederalDataResult[]> {
  console.log('SAM.gov Search params:', {
    searchTerm: params.searchTerm,
    agency: params.agency,
    startDate: params.startDate,
    endDate: params.endDate,
    page: params.page,
    timestamp: new Date().toISOString()
  })

  try {
    const queryParams = new URLSearchParams()
    queryParams.append('api_key', apiKey)
    
    // Add keyword search
    if (params.searchTerm?.trim()) {
      queryParams.append('keywords', params.searchTerm.trim())
    }

    // Add agency filter
    if (params.agency && params.agency !== 'all') {
      queryParams.append('department', params.agency)
    }

    // Add date filters
    if (params.startDate) {
      queryParams.append('postedFrom', new Date(params.startDate).toISOString().split('T')[0])
    }
    if (params.endDate) {
      queryParams.append('postedTo', new Date(params.endDate).toISOString().split('T')[0])
    }

    // Add pagination
    queryParams.append('page', (params.page || 0).toString())
    queryParams.append('limit', '10')

    const requestUrl = `${SAM_API_URL}?${queryParams}`
    console.log('SAM.gov API request URL:', requestUrl)

    const response = await withRetry(async () => {
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
          error: errorText
        })
        throw new Error(`SAM.gov API error: ${res.status} ${errorText}`)
      }

      return res
    })

    const data = await response.json()
    console.log('SAM.gov Raw response:', {
      opportunitiesCount: data.opportunitiesData?.length || 0,
      totalRecords: data.totalRecords || 0
    })

    const results = (data.opportunitiesData || []).map((opp: any) => ({
      id: opp.noticeId || crypto.randomUUID(),
      title: opp.title || 'Untitled Opportunity',
      description: opp.description || '',
      agency: opp.department || params.agency || null,
      type: opp.noticeType || 'Unknown',
      posted_date: opp.postedDate || null,
      value: opp.baseAndAllOptionsValue || null,
      response_due: opp.responseDeadLine || null,
      naics_code: opp.naicsCode || null,
      set_aside: opp.setAside || null
    }))

    console.log('SAM.gov Transformed results:', {
      count: results.length,
      firstResult: results[0] || null
    })

    return results
  } catch (error) {
    console.error('SAM.gov fetch error:', error)
    throw error
  }
}