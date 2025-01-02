import { PaginatedResponse, FederalDataResult, SearchParams } from '../types.ts'
import { fetchSAMData } from './sam.ts'
import { fetchFPDSData } from './fpds.ts'
import { logError } from '../utils/logging.ts'
import { sortResults } from '../utils/sorting.ts'

export async function searchFederalOpportunities(params: SearchParams): Promise<PaginatedResponse<FederalDataResult>> {
  console.log('Searching federal opportunities:', {
    searchTerm: params.searchTerm,
    agency: params.agency,
    startDate: params.startDate,
    endDate: params.endDate,
    page: params.page,
    timestamp: new Date().toISOString()
  })
  
  try {
    let successfulSources = 0
    let results: FederalDataResult[] = []
    let errors: string[] = []

    // Fetch from SAM.gov
    try {
      const samApiKey = Deno.env.get('SAM_API_KEY')
      if (!samApiKey) {
        console.error('SAM API key is missing')
        errors.push('SAM.gov: API key is missing')
      } else {
        console.log('Fetching from SAM.gov with params:', params)
        const samResults = await fetchSAMData(params, samApiKey)
        if (samResults && Array.isArray(samResults)) {
          results = [...results, ...samResults]
          successfulSources++
          console.log('SAM.gov fetch successful:', {
            count: samResults.length,
            firstResult: samResults[0],
            timestamp: new Date().toISOString()
          })
        }
      }
    } catch (samError) {
      const errorMessage = samError instanceof Error ? samError.message : 'Unknown error'
      errors.push(`SAM.gov: ${errorMessage}`)
      logError('SAM.gov fetch', samError)
    }

    // Fetch from FPDS
    try {
      console.log('Fetching from FPDS with params:', params)
      const fpdsResults = await fetchFPDSData(params)
      if (fpdsResults && Array.isArray(fpdsResults)) {
        results = [...results, ...fpdsResults]
        successfulSources++
        console.log('FPDS fetch successful:', {
          count: fpdsResults.length,
          firstResult: fpdsResults[0],
          timestamp: new Date().toISOString()
        })
      }
    } catch (fpdsError) {
      const errorMessage = fpdsError instanceof Error ? fpdsError.message : 'Unknown error'
      errors.push(`FPDS: ${errorMessage}`)
      logError('FPDS fetch', fpdsError)
    }

    // Log overall search status
    console.log('Search status:', {
      successfulSources,
      totalErrors: errors.length,
      errors,
      resultsCount: results.length,
      timestamp: new Date().toISOString()
    })

    if (successfulSources === 0 && errors.length > 0) {
      console.error('Failed to fetch data from all sources:', errors)
      throw new Error(`Failed to fetch data from all available sources: ${errors.join('; ')}`)
    }

    // Apply search term filter if provided and not '*'
    if (params.searchTerm?.trim() && params.searchTerm !== '*') {
      const searchTermLower = params.searchTerm.toLowerCase().trim()
      const filteredResults = results.filter(result => 
        result.title?.toLowerCase().includes(searchTermLower) ||
        result.description?.toLowerCase().includes(searchTermLower)
      )
      console.log('Search term filtering:', {
        before: results.length,
        after: filteredResults.length,
        searchTerm: searchTermLower
      })
      results = filteredResults
    }

    // Sort results if needed
    if (params.sortField) {
      results = sortResults(results, params.sortField, params.sortDirection)
    }

    // Apply pagination
    const page = params.page || 0
    const limit = Math.min(params.limit || 100, 100) // Cap at 100 results per page
    const totalRecords = results.length
    const totalPages = Math.ceil(totalRecords / limit)
    const start = page * limit
    const end = start + limit
    
    const paginatedResults = results.slice(start, end)

    console.log('Final search results:', {
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