import { searchStateOpportunities } from './state-procurement.ts'
import { searchLocalOpportunities } from './local-procurement.ts'
import { searchFederalOpportunities } from './federal-procurement.ts'

export async function aggregateSearchResults(params: {
  searchTerm?: string
  agency?: string
  state?: string
  city?: string
  startDate?: string
  endDate?: string
  noticeType?: string
  activeOnly?: boolean
}) {
  console.log('Aggregating search results with params:', params)

  try {
    // Fetch from all sources in parallel
    const [federalResults, stateResults, localResults] = await Promise.all([
      searchFederalOpportunities(params),
      searchStateOpportunities({ 
        searchTerm: params.searchTerm,
        state: params.state 
      }),
      searchLocalOpportunities({
        searchTerm: params.searchTerm,
        state: params.state,
        city: params.city
      })
    ])

    // Combine and deduplicate results
    const allResults = [
      ...(federalResults || []),
      ...(stateResults || []),
      ...(localResults || [])
    ]

    console.log(`Found ${allResults.length} total results:`, {
      federal: federalResults?.length || 0,
      state: stateResults?.length || 0,
      local: localResults?.length || 0
    })

    return allResults
  } catch (error) {
    console.error('Error aggregating search results:', error)
    return []
  }
}