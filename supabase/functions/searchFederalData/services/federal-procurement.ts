import { fetchSAMData } from './sam.ts'
import { fetchFPDSData } from './fpds.ts'
import { PaginatedResponse, FederalDataResult } from '../types.ts'

interface SearchParams {
  searchTerm?: string
  agency?: string
  startDate?: string
  endDate?: string
  noticeType?: string
  activeOnly?: boolean
  page?: number
  limit?: number
}

export async function searchFederalOpportunities(params: SearchParams): Promise<PaginatedResponse<FederalDataResult>> {
  console.log('Searching federal opportunities:', params)
  
  try {
    // Fetch from multiple federal sources in parallel
    const [samResults, fpdsResults] = await Promise.allSettled([
      fetchSAMData({ ...params, page: params.page || 0 }, Deno.env.get('SAM_API_KEY') || ''),
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

    // Calculate pagination
    const page = params.page || 0
    const limit = params.limit || 100
    const totalRecords = results.length
    const totalPages = Math.ceil(totalRecords / limit)
    const start = page * limit
    const end = start + limit

    // Slice results for current page
    const paginatedResults = results.slice(start, end)

    console.log('Combined federal search results:', {
      total: totalRecords,
      currentPage: page,
      totalPages,
      resultsOnPage: paginatedResults.length,
    })

    return {
      data: paginatedResults,
      totalPages,
      currentPage: page,
      totalRecords,
    }
  } catch (error) {
    console.error('Error in searchFederalOpportunities:', error)
    return {
      data: [],
      totalPages: 0,
      currentPage: 0,
      totalRecords: 0,
    }
  }
}