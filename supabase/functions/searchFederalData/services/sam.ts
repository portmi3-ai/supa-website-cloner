import { SearchParams, FederalDataResult } from '../types.ts'
import { withRetry } from '../utils/apiRetry.ts'

const SAM_API_URL = "https://api.sam.gov/entity-information/v3/entities"
const PAGE_SIZE = 50 // Reduced from 100 to 50 for better reliability

export async function fetchSAMData(params: SearchParams, apiKey: string): Promise<FederalDataResult[]> {
  console.log('Fetching SAM.gov data with params:', {
    hasSearchTerm: !!params.searchTerm,
    agency: params.agency,
    page: params.page || 0,
  })

  try {
    if (!apiKey) {
      console.error('SAM API key is missing')
      throw new Error('SAM API key is required')
    }

    const allResults: FederalDataResult[] = []
    let currentPage = params.page || 0
    let hasMorePages = true

    while (hasMorePages) {
      const results = await fetchSAMDataPage(params, apiKey, currentPage)
      
      if (!results || results.length === 0) {
        hasMorePages = false
        break
      }

      allResults.push(...results)
      
      // Stop if we have enough results or reached the end
      if (results.length < PAGE_SIZE || allResults.length >= (params.limit || 100)) {
        hasMorePages = false
      } else {
        currentPage++
      }
    }

    // Trim results to match requested limit
    if (params.limit && allResults.length > params.limit) {
      return allResults.slice(0, params.limit)
    }

    return allResults
  } catch (error) {
    console.error('SAM.gov fetch error:', error)
    throw error // Let the error handler in the Edge Function handle this
  }
}

async function fetchSAMDataPage(params: SearchParams, apiKey: string, page: number): Promise<FederalDataResult[]> {
  const queryParams = new URLSearchParams()
  queryParams.append('api_key', apiKey)
  queryParams.append('q', params.searchTerm?.trim() || '*')
  queryParams.append('page', page.toString())
  queryParams.append('size', PAGE_SIZE.toString())

  if (params.agency && params.agency !== 'all') {
    queryParams.append('organizationId', params.agency)
  }

  const requestUrl = `${SAM_API_URL}?${queryParams}`
  console.log('Making SAM.gov API request:', {
    url: SAM_API_URL,
    query: params.searchTerm?.trim() || '*',
    hasAgency: !!params.agency,
    page,
    size: PAGE_SIZE,
  })

  const response = await withRetry(
    async () => {
      const res = await fetch(requestUrl, {
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('SAM.gov API error:', {
          status: res.status,
          statusText: res.statusText,
          error: errorText,
          timestamp: new Date().toISOString(),
          requestUrl: requestUrl.replace(apiKey, '[REDACTED]'),
        })
        throw new Error(`SAM.gov API error: ${res.status} ${res.statusText}\n${errorText}`)
      }

      return res
    },
    {
      maxAttempts: 5,
      initialDelay: 1000,
      maxDelay: 5000,
    }
  )

  const data = await response.json()
  console.log('SAM.gov page results:', {
    page,
    count: data.entityData?.length || 0,
    totalRecords: data.totalRecords || 0,
  })

  return (data.entityData || []).map((entity: any) => ({
    id: entity.ueiSAM || crypto.randomUUID(),
    title: entity.entityRegistration?.legalBusinessName || 'Unnamed Entity',
    description: `${entity.entityRegistration?.businessType || ''} - ${entity.entityRegistration?.physicalAddress?.city || ''}, ${entity.entityRegistration?.physicalAddress?.stateOrProvinceCode || ''}`,
    funding_agency: null,
    funding_amount: null,
    status: 'active',
    source: 'SAM.gov',
    entity_type: entity.entityRegistration?.businessType || null,
    location: `${entity.entityRegistration?.physicalAddress?.city || ''}, ${entity.entityRegistration?.physicalAddress?.stateOrProvinceCode || ''}`,
    registration_status: entity.entityRegistration?.registrationStatus || null
  }))
}