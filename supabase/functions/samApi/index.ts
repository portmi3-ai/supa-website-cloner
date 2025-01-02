import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { searchTerm } = await req.json()
    const apiKey = Deno.env.get('SAM_API_KEY')

    if (!apiKey) {
      throw new Error('SAM API key is not configured')
    }

    const response = await fetch(
      `https://api.sam.gov/entity-information/v3/entities?api_key=${apiKey}&q=${searchTerm}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`SAM API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in samApi:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})