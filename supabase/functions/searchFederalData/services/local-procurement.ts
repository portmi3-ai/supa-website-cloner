interface LocalSource {
  name: string
  url: string
  city: string
  state: string
}

const LOCAL_SOURCES: LocalSource[] = [
  {
    name: "Los Angeles Business Assistance Virtual Network",
    url: "https://labavn.org",
    city: "Los Angeles",
    state: "CA"
  },
  {
    name: "NYC PASSPort",
    url: "https://www1.nyc.gov/site/mocs/systems/about-go-to-passport.page",
    city: "New York City",
    state: "NY"
  },
  {
    name: "Chicago eProcurement",
    url: "https://www.chicago.gov/city/en/depts/dps.html",
    city: "Chicago",
    state: "IL"
  },
  {
    name: "Houston Supplier Portal",
    url: "https://purchasing.houstontx.gov",
    city: "Houston",
    state: "TX"
  },
  {
    name: "Phoenix Vendor Self Service",
    url: "https://phoenix.gov/finance/vendorselfservice",
    city: "Phoenix",
    state: "AZ"
  }
]

export async function searchLocalOpportunities(searchParams: {
  searchTerm?: string
  city?: string
  state?: string
}) {
  try {
    console.log('Searching local opportunities:', searchParams)
    
    // Filter sources based on city/state if provided
    let sources = LOCAL_SOURCES
    if (searchParams.city) {
      sources = sources.filter(source => 
        source.city.toLowerCase() === searchParams.city?.toLowerCase()
      )
    }
    if (searchParams.state) {
      sources = sources.filter(source => source.state === searchParams.state)
    }

    // Fetch from each local source in parallel
    const localResults = await Promise.allSettled(
      sources.map(async (source) => {
        try {
          // Here we would normally make an API call to each local procurement system
          // For now, we'll return placeholder data
          return {
            id: crypto.randomUUID(),
            title: `${source.city} Municipal Opportunity`,
            description: `Opportunity from ${source.name}`,
            agency: source.name,
            type: 'Local Contract',
            posted_date: new Date().toISOString(),
            source: source.name,
            city: source.city,
            state: source.state
          }
        } catch (error) {
          console.error(`Error fetching from ${source.name}:`, error)
          return null
        }
      })
    )

    return localResults
      .filter((result): result is PromiseFulfilledResult<any> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value)
  } catch (error) {
    console.error('Error in searchLocalOpportunities:', error)
    return []
  }
}