import { SearchParams, FederalDataResult } from '../types.ts'

const SAM_API_URL = "https://api.sam.gov/entity-information/v3/entities"

export async function fetchSAMData(params: SearchParams, apiKey: string): Promise<FederalDataResult[]> {
  console.log('Fetching SAM.gov data with params:', params)
  try {
    if (!apiKey) {
      console.error('SAM API key is missing')
      throw new Error('SAM API key is required')
    }

    const response = await fetch(`${SAM_API_URL}?q=${params.searchTerm}`, {
      headers: {
        'X-Api-Key': apiKey,
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('SAM.gov API error:', response.status, errorText)
      throw new Error(`SAM.gov API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('SAM.gov results count:', data.totalRecords || 0)
    
    return (data.entities || []).map((entity: any) => ({
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
    throw error
  }
}