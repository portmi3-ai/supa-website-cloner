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

    // Format dates as MM/dd/yyyy for SAM.gov API
    const formatDateForSAM = (dateString: string | undefined) => {
      if (!dateString) return undefined
      const date = new Date(dateString)
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`
    }

    // Get current date and 30 days ago for default date range
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)

    // Build SAM.gov query parameters
    const samParams = new URLSearchParams({
      api_key: apiKey,
      limit: '10',
      offset: '0',
      postedFrom: formatDateForSAM(startDate) || formatDateForSAM(thirtyDaysAgo.toISOString()),
      postedTo: formatDateForSAM(endDate) || formatDateForSAM(today.toISOString()),
    })

    // Add search term if provided (but don't require it)
    if (searchTerm) {
      samParams.append('keywords', searchTerm)
    }

    // Add agency filter if specified
    if (agency && agency !== 'all') {
      // Map frontend agency codes to SAM.gov department codes
      const agencyMapping: { [key: string]: string } = {
        'DOD': 'DEPT OF DEFENSE',
        'NASA': 'NATIONAL AERONAUTICS AND SPACE ADMINISTRATION',
        'DOE': 'DEPT OF ENERGY',
        'HHS': 'DEPT OF HEALTH AND HUMAN SERVICES'
      }
      
      const mappedAgency = agencyMapping[agency]
      if (mappedAgency) {
        samParams.append('department', mappedAgency)
        console.log('Added agency filter:', mappedAgency)
      }
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
      throw new Error(`SAM.gov API error: ${samResponse.status}\n${errorText}`)
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