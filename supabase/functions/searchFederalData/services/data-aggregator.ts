import { searchFederalOpportunities } from './federal-procurement.ts'
import { FederalDataResult, SearchParams } from '../types.ts'

export async function aggregateSearchResults(params: SearchParams): Promise<FederalDataResult[]> {
  console.log('Aggregating search results with params:', params)

  try {
    const federalResults = await searchFederalOpportunities(params)
    console.log(`Found ${federalResults.length} federal results`)

    // Apply filters to combined results
    let allResults = [...federalResults]

    // Apply agency filter if specified
    if (params.agency && params.agency !== 'all') {
      allResults = allResults.filter(result => 
        result.agency?.toLowerCase().includes(params.agency?.toLowerCase() || '')
      )
    }

    // Apply date range filters if specified
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

    // Apply active only filter
    if (params.activeOnly) {
      const now = new Date()
      allResults = allResults.filter(result => 
        result.response_due ? new Date(result.response_due) >= now : true
      )
    }

    console.log(`Returning ${allResults.length} total results after filtering`)
    return allResults
  } catch (error) {
    console.error('Error aggregating search results:', error)
    throw error
  }
}