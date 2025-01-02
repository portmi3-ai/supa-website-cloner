import { fetchSAMData } from './sam.ts'
import { fetchFPDSData } from './fpds.ts'

interface SearchParams {
  searchTerm?: string
  agency?: string
  startDate?: string
  endDate?: string
  noticeType?: string
  activeOnly?: boolean
}

export async function searchFederalOpportunities(params: SearchParams) {
  console.log('Searching federal opportunities:', params)
  
  try {
    // Fetch from multiple federal sources in parallel
    const [samResults, fpdsResults] = await Promise.allSettled([
      fetchSAMData(params, Deno.env.get('SAM_API_KEY') || ''),
      fetchFPDSData(params)
    ])

    // Log results from each source
    console.log('SAM.gov results:', {
      status: samResults.status,
      count: samResults.status === 'fulfilled' ? samResults.value.length : 0,
    })
    console.log('FPDS results:', {
      status: fpdsResults.status,
      count: fpdsResults.status === 'fulfilled' ? fpdsResults.value.length : 0,
    })

    // Combine and filter results
    let results = [
      ...(samResults.status === 'fulfilled' ? samResults.value : []),
      ...(fpdsResults.status === 'fulfilled' ? fpdsResults.value : [])
    ]

    // Apply search term filter if specified
    if (params.searchTerm?.trim()) {
      const searchTermLower = params.searchTerm.toLowerCase().trim()
      results = results.filter(result => 
        result.title?.toLowerCase().includes(searchTermLower) ||
        result.description?.toLowerCase().includes(searchTermLower)
      )
    }

    console.log('Combined federal search results:', results.length)
    return results
  } catch (error) {
    console.error('Error in searchFederalOpportunities:', error)
    return []
  }
}