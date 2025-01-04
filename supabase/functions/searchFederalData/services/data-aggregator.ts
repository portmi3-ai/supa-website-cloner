import { searchFederalOpportunities } from './federal-procurement.ts'
import { searchContractData } from './contract-data.ts'
import { searchEntityData } from './entity-data.ts'
import { searchFPDSData } from './fpds-data.ts'
import { FederalDataResult, SearchParams } from '../types.ts'
import { withRetry } from '../utils/apiRetry.ts'

export async function aggregateSearchResults(params: SearchParams) {
  console.log('Aggregating search results with params:', {
    ...params,
    timestamp: new Date().toISOString()
  })

  try {
    // Fetch data from all sources in parallel with retry logic
    const [
      federalResults,
      contractResults,
      entityResults,
      fpdsResults
    ] = await Promise.allSettled([
      withRetry(() => searchFederalOpportunities(params), {
        maxAttempts: 3,
        initialDelay: 1000,
        retryableStatuses: [429, 500, 502, 503, 504]
      }),
      withRetry(() => searchContractData(params), {
        maxAttempts: 2,
        initialDelay: 500
      }),
      withRetry(() => searchEntityData({ keyword: params.searchTerm }), {
        maxAttempts: 2,
        initialDelay: 500
      }),
      withRetry(() => searchFPDSData(params), {
        maxAttempts: 2,
        initialDelay: 500
      })
    ])

    console.log('Search results received:', {
      federalStatus: federalResults.status,
      contractStatus: contractResults.status,
      entityStatus: entityResults.status,
      fpdsStatus: fpdsResults.status,
      timestamp: new Date().toISOString()
    })

    // Combine results from all successful API calls
    let allResults: FederalDataResult[] = []

    if (federalResults.status === 'fulfilled') {
      allResults = [...allResults, ...federalResults.value.results]
    }

    if (contractResults.status === 'fulfilled') {
      const contractData = contractResults.value.map((item: any) => ({
        id: item.contractId,
        title: item.title || 'No Title',
        agency: item.agency,
        type: 'contract',
        posted_date: item.datePosted,
        value: item.contractValue,
        response_due: null,
        naics_code: item.naicsCode,
        set_aside: null,
        source: 'contract-data'
      }))
      allResults = [...allResults, ...contractData]
    }

    if (fpdsResults.status === 'fulfilled') {
      const fpdsData = fpdsResults.value.map((item: any) => ({
        id: item.id,
        title: item.title || 'No Title',
        agency: item.agency,
        type: 'fpds',
        posted_date: item.date,
        value: item.obligatedAmount,
        response_due: null,
        naics_code: item.naicsCode,
        set_aside: null,
        source: 'fpds'
      }))
      allResults = [...allResults, ...fpdsData]
    }

    // Apply filters to combined results
    if (params.agency && params.agency !== 'all') {
      allResults = allResults.filter(result => 
        result.agency?.toLowerCase().includes(params.agency?.toLowerCase() || '')
      )
    }

    if (params.startDate) {
      const startDate = new Date(params.startDate)
      allResults = allResults.filter(result => 
        result.posted_date ? new Date(result.posted_date) >= startDate : true
      )
    }

    if (params.endDate) {
      const endDate = new Date(params.endDate)
      allResults = allResults.filter(result => 
        result.posted_date ? new Date(result.posted_date) <= endDate : true
      )
    }

    // Calculate pagination
    const totalRecords = allResults.length
    const pageSize = params.limit || 10
    const totalPages = Math.ceil(totalRecords / pageSize)
    const currentPage = params.page || 0
    const start = currentPage * pageSize
    const end = start + pageSize

    console.log(`Returning ${allResults.length} total results for page ${currentPage + 1} of ${totalPages}`, {
      timestamp: new Date().toISOString()
    })
    
    return {
      data: allResults.slice(start, end),
      totalRecords,
      currentPage,
      totalPages
    }
  } catch (error) {
    console.error('Error aggregating search results:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}