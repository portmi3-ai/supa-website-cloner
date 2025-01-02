import { SearchParams, FederalDataResult } from '../types.ts'

const SAM_API_URL = "https://api.sam.gov/entity-information/v3/entities"

export async function fetchSAMData(params: SearchParams, apiKey: string): Promise<FederalDataResult[]> {
  console.log('Fetching SAM.gov data with params:', {
    hasSearchTerm: !!params.searchTerm,
    agency: params.agency,
  })

  try {
    if (!apiKey) {
      console.error('SAM API key is missing')
      throw new Error('SAM API key is required')
    }

    // Build query parameters
    const queryParams = new URLSearchParams()
    queryParams.append('api_key', apiKey)
    
    // Handle empty search query - use '*' as default
    const searchQuery = params.searchTerm?.trim() || '*'
    queryParams.append('q', searchQuery)
    
    queryParams.append('page', '0')
    queryParams.append('size', '100')

    // Add optional agency filter if provided
    if (params.agency && params.agency !== 'all') {
      queryParams.append('organizationId', params.agency)
    }

    const requestUrl = `${SAM_API_URL}?${queryParams}`
    console.log('Making SAM.gov API request:', {
      url: SAM_API_URL,
      query: searchQuery,
      hasAgency: !!params.agency,
    })
    
    const response = await fetch(requestUrl, {
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('SAM.gov API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        requestUrl: requestUrl.replace(apiKey, '[REDACTED]'),
      })
      throw new Error(`SAM.gov API error: ${response.status} ${response.statusText}\n${errorText}`)
    }
    
    const data = await response.json()
    console.log('SAM.gov results count:', data.totalRecords || 0)
    
    // Map API response to FederalDataResult type
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
  } catch (error) {
    console.error('SAM.gov fetch error:', error)
    return []
  }
}