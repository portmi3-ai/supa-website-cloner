import { corsHeaders } from '../cors.ts'
import { ApiError } from '../utils/apiRetry.ts'

export async function searchEntityData(params: {
  keyword?: string
  cage?: string
  duns?: string
}) {
  try {
    const apiKey = Deno.env.get("SAM_API_KEY")
    if (!apiKey) {
      throw new Error('SAM_API_KEY is not configured')
    }

    const queryParams = new URLSearchParams()
    if (params.keyword) queryParams.append('q', params.keyword)
    if (params.cage) queryParams.append('cage', params.cage)
    if (params.duns) queryParams.append('duns', params.duns)

    console.log('Fetching entity data with params:', {
      ...params,
      timestamp: new Date().toISOString()
    })

    const response = await fetch(
      `https://api.gsa.gov/sam/v3/entities?${queryParams.toString()}`,
      {
        headers: {
          ...corsHeaders,
          'X-Api-Key': apiKey,
        },
      }
    )

    if (!response.ok) {
      throw new ApiError(`Entity API Error: ${response.status}`, response.status)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Entity API Error:', error)
    throw error
  }
}