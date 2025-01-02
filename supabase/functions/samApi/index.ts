import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const SAM_API_URL = "https://api.sam.gov/entity-information/v3/entities"

serve(async (req) => {
  console.log('SAM API function called')
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { searchTerm, agency } = await req.json()
    console.log('Request parameters:', { searchTerm, agency })
    
    const apiKey = Deno.env.get('SAM_API_KEY')
    if (!apiKey) {
      console.error('SAM API key is missing')
      throw new Error('SAM API configuration is incomplete')
    }

    // Build query parameters
    const params = new URLSearchParams({
      api_key: apiKey,
      q: searchTerm || '*',
      page: '0',
      size: '10',
    })

    if (agency && agency !== 'all') {
      params.append('organizationId', agency)
    }

    const url = `${SAM_API_URL}?${params.toString()}`
    console.log('Making request to SAM.gov:', url.replace(apiKey, '[REDACTED]'))
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('SAM.gov API error:', response.status, errorText)
      throw new Error(`SAM.gov API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('SAM.gov results count:', data.totalRecords || 0)

    const transformedResults = (data.entityData || []).map((entity: any) => ({
      id: entity.entityRegistration?.ueiSAM || crypto.randomUUID(),
      title: entity.entityRegistration?.legalBusinessName || 'Unnamed Entity',
      description: entity.entityRegistration?.purposeOfRegistration || '',
      funding_agency: entity.entityRegistration?.agencyBusinessPurposeCode || null,
      funding_amount: null,
      submission_deadline: null,
      status: 'active',
      source: 'SAM.gov'
    }))

    return new Response(
      JSON.stringify(transformedResults),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('SAM.gov fetch error:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
        message: "Failed to fetch SAM.gov data. Please try again later."
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