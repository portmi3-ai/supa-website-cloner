import { corsHeaders } from '../cors.ts'
import { ApiError } from '../utils/apiRetry.ts'

export async function searchFPDSData(params: {
  keyword?: string
  agency?: string
  startDate?: string
  endDate?: string
}) {
  try {
    const apiKey = Deno.env.get("SAM_API_KEY")
    if (!apiKey) {
      throw new Error('SAM_API_KEY is not configured')
    }

    const queryParams = new URLSearchParams()
    if (params.keyword) queryParams.append('q', params.keyword)
    if (params.agency) queryParams.append('agency', params.agency)
    
    console.log('Fetching FPDS data with params:', {
      ...params,
      timestamp: new Date().toISOString()
    })

    const response = await fetch(
      `https://api.gsa.gov/fpds/v1/opportunities?${queryParams.toString()}`,
      {
        headers: {
          ...corsHeaders,
          'X-Api-Key': apiKey,
        },
      }
    )

    if (!response.ok) {
      throw new ApiError(`FPDS API Error: ${response.status}`, response.status)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('FPDS API Error:', error)
    throw error
  }
}