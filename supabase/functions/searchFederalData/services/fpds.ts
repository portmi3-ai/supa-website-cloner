import { SearchParams, FederalDataResult } from '../types.ts'

const FPDS_API_URL = "https://www.fpds.gov/ezsearch/FEEDS/ATOM"

export async function fetchFPDSData(params: SearchParams): Promise<FederalDataResult[]> {
  console.log('Fetching FPDS data...')
  try {
    const queryParams = new URLSearchParams({
      q: params.searchTerm,
      agency: params.agency || ''
    })

    const response = await fetch(`${FPDS_API_URL}?${queryParams}`)
    
    if (!response.ok) {
      throw new Error(`FPDS API error: ${response.status}`)
    }

    const xmlText = await response.text()
    const contractData = xmlText.match(/<title>(.*?)<\/title>/g) || []
    console.log('FPDS results count:', contractData.length)
    
    return contractData.map(title => ({
      id: crypto.randomUUID(),
      title: title.replace(/<\/?title>/g, ''),
      description: '',
      funding_agency: null,
      funding_amount: null,
      status: 'active',
      source: 'FPDS',
      contract_type: 'federal'
    }))
  } catch (error) {
    console.error('FPDS fetch error:', error)
    return []
  }
}