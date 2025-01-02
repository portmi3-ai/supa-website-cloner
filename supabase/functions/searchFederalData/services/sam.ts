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
    
    // Add keyword search using qterm instead of keywords
    if (params.searchTerm?.trim() && params.searchTerm !== '*') {
      queryParams.append('qterm', params.searchTerm.trim())
    }

    // Add agency filter using deptname instead of department
    if (params.agency && params.agency !== 'all') {
      queryParams.append('deptname', params.agency)
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
    queryParams.append('size', '100') // Request maximum allowed results
    queryParams.append('api_key', apiKey) // Add API key to query params

    const requestUrl = `${SAM_API_URL}?${queryParams}`
    console.log('SAM.gov API request URL:', requestUrl)

    const response = await withRetry(async () => {
      const res = await fetch(requestUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`, // Add Bearer token
        }
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('SAM.gov API error:', {
          status: res.status,
          statusText: res.statusText,
          error: errorText,
          headers: Object.fromEntries(res.headers.entries())
        })
        throw new Error(`SAM.gov API error: ${res.status} ${errorText}`)
      }

      return res
    })

    const data = await response.json()
    console.log('SAM.gov Raw response:', {
      opportunitiesCount: data.opportunitiesData?.length || 0,
      totalRecords: data.totalRecords || 0,
      metadata: data.metadata || {}
    })

    if (!data.opportunitiesData) {
      console.warn('No opportunities data in response:', data)
      return []
    }

    const results = data.opportunitiesData.map((opp: any) => ({
      id: opp.noticeId || crypto.randomUUID(),
      title: opp.title || 'Untitled Opportunity',
      description: opp.description || '',
      agency: opp.departmentName || params.agency || null,
      type: opp.type || 'Unknown',
      posted_date: opp.postedDate || null,
      value: opp.baseAndAllOptionsValue || null,
      response_due: opp.responseDeadLine || null,
      naics_code: opp.naicsCode || null,
      set_aside: opp.setAside || null
    }))

    console.log('SAM.gov Transformed results:', {
      count: results.length,
      firstResult: results[0] || null,
      timestamp: new Date().toISOString()
    })

    return results
  } catch (error) {
    console.error('SAM.gov fetch error:', error)
    throw error
  }
}