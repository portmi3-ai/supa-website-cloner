import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from './cors.ts'
import { SearchParams, FederalDataResult } from './types.ts'
import { fetchSAMData } from './services/sam.ts'
import { fetchUSASpendingData } from './services/usaspending.ts'
import { fetchFPDSData } from './services/fpds.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { searchTerm, agency, startDate, endDate, contractType, page, limit } = await req.json()
    console.log('Searching federal data with params:', { searchTerm, agency, startDate, endDate, contractType, page, limit })

    const searchParams: SearchParams = {
      searchTerm,
      agency,
      startDate,
      endDate,
      contractType,
      page,
      limit
    }

    // Fetch data from multiple sources in parallel
    const [samData, usaSpendingData, fpdsData] = await Promise.all([
      fetchSAMData(searchParams, Deno.env.get("SAM_API_KEY") || ''),
      fetchUSASpendingData(searchParams),
      fetchFPDSData(searchParams)
    ])

    // Merge results
    const mergedResults: FederalDataResult[] = [...samData, ...usaSpendingData, ...fpdsData]
    console.log(`Total results after merging: ${mergedResults.length}`)

    return new Response(
      JSON.stringify(mergedResults),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error in searchFederalData function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "Failed to fetch federal contract data. Please try again later."
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    )
  }
})