import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { vendorProfile } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch opportunities from multiple sources
    const [federalData, contracts] = await Promise.all([
      supabase.from('federal_data').select('*'),
      supabase.from('contracts').select('*')
    ])

    // Use GPT-4 for intelligent matching
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant that matches government contracts with vendor profiles based on their capabilities and requirements.'
          },
          {
            role: 'user',
            content: `Match the following vendor profile with available opportunities:
              Vendor Profile: ${JSON.stringify(vendorProfile)}
              Available Opportunities: ${JSON.stringify([...(federalData.data || []), ...(contracts.data || [])])}`
          }
        ],
      }),
    })

    const matchingResult = await response.json()
    
    return new Response(
      JSON.stringify({
        matches: matchingResult.choices[0].message.content,
        federalData: federalData.data,
        contracts: contracts.data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in match-opportunities function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})