import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const SAM_API_URL = "https://api.sam.gov/opportunities/v2/search"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { searchTerm, agency, startDate, endDate, noticeType, activeOnly } = await req.json()
    console.log('Searching federal data with params:', { searchTerm, agency, startDate, endDate, noticeType, activeOnly })

    const apiKey = Deno.env.get('SAM_API_KEY')
    if (!apiKey) {
      console.error('SAM API key is missing')
      throw new Error('SAM API configuration is incomplete')
    }

    // Get current date and 30 days ago for default date range
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)

    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0]
    }

    // Build SAM.gov query parameters
    const samParams = new URLSearchParams({
      api_key: apiKey,
      limit: '10',
      offset: '0',
      postedFrom: startDate ? startDate : formatDate(thirtyDaysAgo),
      postedTo: endDate ? endDate : formatDate(today),
    })

    // Add search term if provided
    if (searchTerm) {
      samParams.append('keywords', searchTerm)
    }

    // Add agency filter if specified
    if (agency && agency !== 'all') {
      samParams.append('department', agency)
      console.log('Added agency filter:', agency)
    }

    // Add notice type filter if specified
    if (noticeType && noticeType !== 'all') {
      samParams.append('noticeType', noticeType)
      console.log('Added notice type filter:', noticeType)
    }

    // Add active only filter if specified
    if (activeOnly) {
      samParams.append('active', 'Yes')
      console.log('Added active only filter')
    }

    const requestUrl = `${SAM_API_URL}?${samParams.toString()}`
    console.log('Making request to SAM.gov with URL:', requestUrl)
    
    const samResponse = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': apiKey,
      }
    })

    if (!samResponse.ok) {
      const errorText = await samResponse.text()
      console.error('SAM.gov API error response:', errorText)
      throw new Error(`SAM.gov API error: ${samResponse.status} ${samResponse.statusText}\n${errorText}`)
    }

    const samData = await samResponse.json()
    console.log('SAM.gov results count:', samData.totalRecords || 0)

    // Transform SAM.gov results
    const samResults = (samData.opportunitiesData || []).map((opportunity: any) => ({
      id: opportunity.noticeId || crypto.randomUUID(),
      title: opportunity.title || 'Untitled Opportunity',
      description: opportunity.description || '',
      agency: opportunity.department || opportunity.subtier || null,
      type: opportunity.noticeType || 'Unknown',
      posted_date: opportunity.postedDate || null,
      naics_code: opportunity.naicsCode || null,
      set_aside: opportunity.setAside || null,
      response_due: opportunity.responseDeadLine || null,
    }))

    return new Response(
      JSON.stringify(samResults),
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