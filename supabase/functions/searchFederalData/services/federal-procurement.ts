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
    // Track successful sources and results
    let successfulSources = 0
    let results: FederalDataResult[] = []
    let errors: string[] = []

    // Fetch from SAM.gov
    try {
      const samResults = await fetchSAMData(
        { ...params, page: params.page || 0 }, 
        Deno.env.get('SAM_API_KEY') || ''
      )
      if (samResults && Array.isArray(samResults)) {
        results = [...results, ...samResults]
        successfulSources++
        console.log('SAM.gov fetch successful:', {
          count: samResults.length,
          timestamp: new Date().toISOString()
        })
      } else {
        throw new Error('Invalid response format from SAM.gov')
      }
    } catch (samError) {
      const errorMessage = samError instanceof Error ? samError.message : 'Unknown error'
      errors.push(`SAM.gov: ${errorMessage}`)
      console.error('SAM.gov fetch failed:', {
        error: errorMessage,
        stack: samError instanceof Error ? samError.stack : undefined,
        timestamp: new Date().toISOString()
      })
    }

    // Fetch from FPDS
    try {
      const fpdsResults = await fetchFPDSData(params)
      if (fpdsResults && Array.isArray(fpdsResults)) {
        results = [...results, ...fpdsResults]
        successfulSources++
        console.log('FPDS fetch successful:', {
          count: fpdsResults.length,
          timestamp: new Date().toISOString()
        })
      } else {
        throw new Error('Invalid response format from FPDS')
      }
    } catch (fpdsError) {
      const errorMessage = fpdsError instanceof Error ? fpdsError.message : 'Unknown error'
      errors.push(`FPDS: ${errorMessage}`)
      console.error('FPDS fetch failed:', {
        error: errorMessage,
        stack: fpdsError instanceof Error ? fpdsError.stack : undefined,
        timestamp: new Date().toISOString()
      })
    }

    // If no sources were successful, throw an error with details
    if (successfulSources === 0) {
      throw new Error(`Failed to fetch data: ${errors.join('; ')}`)
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

    // Return properly formatted response
    return {
      data: paginatedResults,
      totalPages,
      currentPage: page,
      totalRecords,
    }
  } catch (error) {
    console.error('Error in searchFederalOpportunities:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}