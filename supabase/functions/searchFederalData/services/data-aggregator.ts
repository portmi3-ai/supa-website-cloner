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
      params.state ? searchStateOpportunities({ 
        searchTerm: params.searchTerm,
        state: params.state 
      }) : [],
      (params.state || params.city) ? searchLocalOpportunities({
        searchTerm: params.searchTerm,
        state: params.state,
        city: params.city
      }) : []
    ])

    // Apply filters to combined results
    let allResults = [
      ...(federalResults || []),
      ...(stateResults || []),
      ...(localResults || [])
    ]

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

    // Apply notice type filter if specified
    if (params.noticeType && params.noticeType !== 'all') {
      allResults = allResults.filter(result => 
        result.type?.toLowerCase() === params.noticeType?.toLowerCase()
      )
    }

    // Apply active only filter
    if (params.activeOnly) {
      allResults = allResults.filter(result => 
        result.status?.toLowerCase() === 'active'
      )
    }

    console.log(`Found ${allResults.length} total results after filtering:`, {
      federal: federalResults?.length || 0,
      state: stateResults?.length || 0,
      local: localResults?.length || 0,
      filtered: allResults.length
    })

    return allResults
  } catch (error) {
    console.error('Error aggregating search results:', error)
    return []
  }
}