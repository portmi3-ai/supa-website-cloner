import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const SAM_API_URL = "https://api.sam.gov/entity-information/v3/entities"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { searchTerm, agency } = await req.json()
    const apiKey = Deno.env.get('SAM_API_KEY')
    
    if (!apiKey) {
      console.error('SAM API key is missing')
      throw new Error('SAM API configuration is incomplete')
    }

    console.log('Searching SAM.gov with term:', searchTerm)
    
    const params = new URLSearchParams({
      q: searchTerm || '',
      ...(agency && agency !== 'all' ? { 'organizationId': agency } : {}),
    })

    const response = await fetch(`${SAM_API_URL}?${params.toString()}`, {
      headers: {
        'X-Api-Key': apiKey,
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

    const transformedResults = data.entityData?.map((entity: any) => ({
      id: entity.entityRegistration?.ueiSAM || crypto.randomUUID(),
      title: entity.entityRegistration?.legalBusinessName || 'Unnamed Entity',
      description: entity.entityRegistration?.purposeOfRegistration || '',
      funding_agency: entity.entityRegistration?.agencyBusinessPurposeCode || null,
      funding_amount: null,
      status: 'active',
      submission_deadline: null,
      source: 'SAM.gov'
    })) || []

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