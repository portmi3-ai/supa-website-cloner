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
    // Track successful sources
    let successfulSources = 0
    let results: FederalDataResult[] = []

    // Fetch from SAM.gov
    try {
      const samResults = await fetchSAMData(
        { ...params, page: params.page || 0 }, 
        Deno.env.get('SAM_API_KEY') || ''
      )
      results = [...results, ...samResults]
      successfulSources++
      console.log('SAM.gov fetch successful:', {
        count: samResults.length,
        timestamp: new Date().toISOString()
      })
    } catch (samError) {
      console.error('SAM.gov fetch failed:', {
        error: samError.message,
        stack: samError.stack,
        timestamp: new Date().toISOString()
      })
    }

    // Fetch from FPDS
    try {
      const fpdsResults = await fetchFPDSData(params)
      results = [...results, ...fpdsResults]
      successfulSources++
      console.log('FPDS fetch successful:', {
        count: fpdsResults.length,
        timestamp: new Date().toISOString()
      })
    } catch (fpdsError) {
      console.error('FPDS fetch failed:', {
        error: fpdsError.message,
        stack: fpdsError.stack,
        timestamp: new Date().toISOString()
      })
    }

    // If no sources were successful, throw an error
    if (successfulSources === 0) {
      throw new Error('Failed to fetch data from all available sources')
    }

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
      successfulSources,
      timestamp: new Date().toISOString()
    })

    return {
      data: paginatedResults,
      totalPages,
      currentPage: page,
      totalRecords,
    }
  } catch (error) {
    console.error('Error in searchFederalOpportunities:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}