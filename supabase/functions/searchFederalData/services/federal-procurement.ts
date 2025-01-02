import { PaginatedResponse, FederalDataResult, SearchParams } from '../types.ts'
import { fetchSAMData } from './sam.ts'
import { fetchFPDSData } from './fpds.ts'
import { logError } from '../utils/logging.ts'
import { sortResults } from '../utils/sorting.ts'

export async function searchFederalOpportunities(params: SearchParams): Promise<PaginatedResponse<FederalDataResult>> {
  console.log('Searching federal opportunities:', {
    params,
    timestamp: new Date().toISOString()
  })
  
  try {
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
      }
    } catch (samError) {
      const errorMessage = samError instanceof Error ? samError.message : 'Unknown error'
      errors.push(`SAM.gov: ${errorMessage}`)
      logError('SAM.gov fetch', samError)
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
      }
    } catch (fpdsError) {
      const errorMessage = fpdsError instanceof Error ? fpdsError.message : 'Unknown error'
      errors.push(`FPDS: ${errorMessage}`)
      logError('FPDS fetch', fpdsError)
    }

    if (successfulSources === 0) {
      throw new Error(`Failed to fetch data from all available sources: ${errors.join('; ')}`)
    }

    if (params.searchTerm?.trim()) {
      const searchTermLower = params.searchTerm.toLowerCase().trim()
      results = results.filter(result => 
        result.title?.toLowerCase().includes(searchTermLower) ||
        result.description?.toLowerCase().includes(searchTermLower)
      )
    }

    const page = params.page || 0
    const limit = params.limit || 100
    const totalRecords = results.length
    const totalPages = Math.ceil(totalRecords / limit)
    const start = page * limit
    const end = start + limit

    results = sortResults(results, params.sortField, params.sortDirection)
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
    logError('searchFederalOpportunities', error)
    throw error
  }
}