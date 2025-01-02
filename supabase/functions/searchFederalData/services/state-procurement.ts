interface StateSource {
  name: string
  url: string
  state: string
}

const STATE_SOURCES: StateSource[] = [
  {
    name: "Michigan Contract Connect",
    url: "https://sigma.michigan.gov/webapp/PRDVSS2X1/AltSelfService",
    state: "MI"
  },
  {
    name: "New York State Contract Reporter",
    url: "https://www.nyscr.ny.gov",
    state: "NY"
  },
  {
    name: "California eProcurement",
    url: "https://caleprocure.ca.gov/pages/index.aspx",
    state: "CA"
  },
  {
    name: "Texas SmartBuy",
    url: "https://comptroller.texas.gov/purchasing",
    state: "TX"
  },
  {
    name: "Florida Vendor Bid System",
    url: "https://vendor.myfloridamarketplace.com",
    state: "FL"
  }
]

export async function searchStateOpportunities(searchParams: {
  searchTerm?: string
  state?: string
}) {
  try {
    console.log('Searching state opportunities:', searchParams)
    
    // Filter sources based on state if provided
    const sources = searchParams.state 
      ? STATE_SOURCES.filter(source => source.state === searchParams.state)
      : STATE_SOURCES

    // Fetch from each state source in parallel
    const stateResults = await Promise.allSettled(
      sources.map(async (source) => {
        try {
          // Here we would normally make an API call to each state's procurement system
          // For now, we'll return placeholder data
          return {
            id: crypto.randomUUID(),
            title: `${source.state} Procurement Opportunity`,
            description: `Opportunity from ${source.name}`,
            agency: source.name,
            type: 'State Contract',
            posted_date: new Date().toISOString(),
            source: source.name,
            state: source.state
          }
        } catch (error) {
          console.error(`Error fetching from ${source.name}:`, error)
          return null
        }
      })
    )

    return stateResults
      .filter((result): result is PromiseFulfilledResult<any> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value)
  } catch (error) {
    console.error('Error in searchStateOpportunities:', error)
    return []
  }
}