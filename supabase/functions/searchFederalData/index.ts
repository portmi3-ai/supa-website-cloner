import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const SAM_API_URL = "https://api.sam.gov/opportunities/v2/search"
const FPDS_API_URL = "https://www.fpds.gov/ezsearch/FEEDS/ATOM"
const GRANTS_API_URL = "https://www.grants.gov/grantsws/rest/opportunities/search"

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

    const formatDateForSAM = (dateString: string | undefined) => {
      if (!dateString) return undefined
      const date = new Date(dateString)
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`
    }

    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)

    const samParams = new URLSearchParams({
      api_key: apiKey,
      limit: '100', // Increased from 10 to get more results
      offset: '0',
      postedFrom: formatDateForSAM(startDate) || formatDateForSAM(thirtyDaysAgo.toISOString()),
      postedTo: formatDateForSAM(endDate) || formatDateForSAM(today.toISOString()),
    })

    if (searchTerm) {
      samParams.append('keywords', searchTerm)
    }

    if (agency && agency !== 'all') {
      const agencyMapping: { [key: string]: string } = {
        'DOD': 'DEPT OF DEFENSE',
        'NASA': 'NATIONAL AERONAUTICS AND SPACE ADMINISTRATION',
        'DOE': 'DEPT OF ENERGY',
        'HHS': 'DEPT OF HEALTH AND HUMAN SERVICES',
        'DHS': 'DEPT OF HOMELAND SECURITY',
        'DOT': 'DEPT OF TRANSPORTATION',
        'VA': 'DEPT OF VETERANS AFFAIRS',
        'DOI': 'DEPT OF THE INTERIOR',
        'EPA': 'ENVIRONMENTAL PROTECTION AGENCY',
        'USDA': 'DEPT OF AGRICULTURE',
        'DOC': 'DEPT OF COMMERCE',
        'ED': 'DEPT OF EDUCATION',
        'DOL': 'DEPT OF LABOR',
        'STATE': 'DEPT OF STATE',
        'TREAS': 'DEPT OF THE TREASURY'
      }
      
      const mappedAgency = agencyMapping[agency]
      if (mappedAgency) {
        samParams.append('department', mappedAgency)
        console.log('Added agency filter:', mappedAgency)
      }
    }

    if (noticeType && noticeType !== 'all') {
      samParams.append('noticeType', noticeType)
      console.log('Added notice type filter:', noticeType)
    }

    if (activeOnly) {
      samParams.append('active', 'Yes')
      console.log('Added active only filter')
    }

    const requestUrl = `${SAM_API_URL}?${samParams.toString()}`
    console.log('Making request to SAM.gov with URL:', requestUrl)
    
    // Fetch from SAM.gov
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
      value: opportunity.estimatedTotalValue || null,
      source: 'SAM.gov'
    }))

    // Try to fetch from FPDS if no agency filter is applied or if it matches
    let fpdsResults: any[] = []
    if (!agency || agency === 'all') {
      try {
        const fpdsResponse = await fetch(`${FPDS_API_URL}?q=${searchTerm || ''}`)
        if (fpdsResponse.ok) {
          const fpdsText = await fpdsResponse.text()
          const matches = fpdsText.match(/<entry>(.*?)<\/entry>/gs) || []
          fpdsResults = matches.map(entry => {
            const title = entry.match(/<title>(.*?)<\/title>/)?.[1] || ''
            const id = entry.match(/<id>(.*?)<\/id>/)?.[1] || crypto.randomUUID()
            const content = entry.match(/<content type="text">(.*?)<\/content>/)?.[1] || ''
            return {
              id,
              title,
              description: content,
              agency: null,
              type: 'Contract Award',
              posted_date: new Date().toISOString(),
              source: 'FPDS'
            }
          })
          console.log('FPDS results count:', fpdsResults.length)
        }
      } catch (error) {
        console.error('FPDS fetch error:', error)
      }
    }

    // Combine results from all sources
    const allResults = [...samResults, ...fpdsResults]
    console.log('Total combined results:', allResults.length)

    return new Response(
      JSON.stringify(allResults),
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