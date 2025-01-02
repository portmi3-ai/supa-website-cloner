import { SearchParams, FederalDataResult } from '../types.ts'

const FPDS_API_URL = "https://www.fpds.gov/ezsearch/FEEDS/ATOM"

export async function fetchFPDSData(params: SearchParams): Promise<FederalDataResult[]> {
  console.log('Fetching FPDS data with params:', {
    hasSearchTerm: !!params.searchTerm,
    agency: params.agency,
  })

  try {
    // Ensure search query is valid - if empty or undefined, use '*' as default
    const searchQuery = params.searchTerm?.trim() || '*'
    
    // Validate search query
    if (searchQuery === '') {
      console.warn('Empty search query provided for FPDS, using default "*"')
    }

    // Build query parameters
    const queryParams = new URLSearchParams()
    queryParams.append('q', searchQuery)

    // Add optional agency filter if provided
    if (params.agency && params.agency !== 'all') {
      queryParams.append('agency', params.agency)
    }

    const requestUrl = `${FPDS_API_URL}?${queryParams}`
    console.log('Making FPDS API request:', {
      url: FPDS_API_URL,
      query: searchQuery,
      hasAgency: !!params.agency,
      requestUrl,
    })
    
    const response = await fetch(requestUrl)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('FPDS API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        requestUrl,
      })
      throw new Error(`FPDS API error: ${response.status} ${errorText}`)
    }

    const xmlText = await response.text()
    const contractData = xmlText.match(/<title>(.*?)<\/title>/g) || []
    console.log('FPDS results count:', contractData.length)
    
    return contractData.map(title => ({
      id: crypto.randomUUID(),
      title: title.replace(/<\/?title>/g, ''),
      description: '',
      funding_agency: params.agency || null,
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