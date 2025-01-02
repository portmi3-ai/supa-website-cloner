import { SearchParams } from '../types.ts'
import { corsHeaders } from '../cors.ts'

const SAM_API_URL = 'https://api.sam.gov/entity-information/v3/entities'

interface SAMApiResponse {
  totalRecords: number
  entityData: Array<{
    entityRegistration: {
      ueiSAM: string
      legalBusinessName: string
      physicalAddress: {
        addressLine1: string
        city: string
        stateOrProvinceCode: string
        zipCode: string
      }
    }
  }>
}

function buildQueryParams(params: SearchParams): URLSearchParams {
  const queryParams = new URLSearchParams()

  // Required search parameters
  if (params.searchTerm && params.searchTerm !== '*') {
    queryParams.append('qterm', params.searchTerm)
  }

  // Optional filters
  if (params.agency) {
    queryParams.append('deptname', params.agency)
  }

  // Date range filters
  if (params.startDate) {
    queryParams.append('registrationStartDate', params.startDate)
  }
  if (params.endDate) {
    queryParams.append('registrationEndDate', params.endDate)
  }

  // Pagination
  queryParams.append('page', (params.page || 0).toString())
  queryParams.append('size', '100') // Request maximum allowed results

  return queryParams
}

async function makeApiRequest(url: string, apiKey: string): Promise<Response> {
  console.log('Making SAM.gov API request to:', url)
  
  try {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      ...corsHeaders
    }

    console.log('Request headers:', JSON.stringify(headers, null, 2))

    const response = await fetch(url, {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('SAM.gov API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries())
      })
      throw new Error(`SAM.gov API error: ${response.status} ${errorText}`)
    }

    return response
  } catch (error) {
    console.error('SAM.gov API request failed:', error)
    throw new Error(`SAM.gov API request failed: ${error.message}`)
  }
}

async function parseApiResponse(response: Response): Promise<any> {
  try {
    const data = await response.json()
    console.log('SAM.gov API response:', {
      totalRecords: data.totalRecords,
      recordCount: data.entityData?.length || 0,
      firstRecord: data.entityData?.[0] || null
    })
    return data
  } catch (error) {
    console.error('Failed to parse SAM.gov API response:', error)
    throw new Error(`Failed to parse SAM.gov API response: ${error.message}`)
  }
}

function transformEntityData(entityData: SAMApiResponse['entityData']) {
  return entityData.map(entity => ({
    id: entity.entityRegistration.ueiSAM,
    title: entity.entityRegistration.legalBusinessName,
    location: `${entity.entityRegistration.physicalAddress.city}, ${entity.entityRegistration.physicalAddress.stateOrProvinceCode}`,
    type: 'Entity Registration',
    status: 'Active'
  }))
}

export async function fetchSAMData(params: SearchParams, apiKey: string) {
  if (!apiKey) {
    console.error('SAM.gov API key is missing')
    throw new Error('SAM.gov API key is required')
  }

  try {
    // Build query parameters
    const queryParams = buildQueryParams(params)
    const requestUrl = `${SAM_API_URL}?${queryParams}`

    console.log('SAM.gov API request details:', {
      url: requestUrl,
      params: Object.fromEntries(queryParams.entries()),
      timestamp: new Date().toISOString()
    })

    // Make API request
    const response = await makeApiRequest(requestUrl, apiKey)
    
    // Parse response
    const data = await parseApiResponse(response)
    
    // Transform and return data
    const transformedData = transformEntityData(data.entityData || [])
    
    console.log('SAM.gov data transformation complete:', {
      originalCount: data.entityData?.length || 0,
      transformedCount: transformedData.length,
      timestamp: new Date().toISOString()
    })

    return transformedData
  } catch (error) {
    console.error('Error fetching SAM.gov data:', error)
    throw error
  }
}