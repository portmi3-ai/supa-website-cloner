import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const SAM_API_URL = "https://api.sam.gov/opportunities/v2/search"
const FPDS_API_URL = "https://www.fpds.gov/ezsearch/FEEDS/ATOM"
const GRANTS_API_URL = "https://www.grants.gov/grantsws/rest/opportunities/search"
const DSBS_API_URL = "https://web.sba.gov/pro-net/search/dsp_dsbs.cfm"
const GSA_API_URL = "https://www.gsaadvantage.gov/advantage/s/search.do"

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
      limit: '100',
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
        'TREAS': 'DEPT OF THE TREASURY',
        'GSA': 'GENERAL SERVICES ADMINISTRATION',
        'SBA': 'SMALL BUSINESS ADMINISTRATION',
        'PTAC': 'PROCUREMENT TECHNICAL ASSISTANCE CENTER',
        'LOCAL': 'LOCAL GOVERNMENT',
        'STATE_PROC': 'STATE PROCUREMENT'
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

    // Fetch from multiple sources in parallel
    const [samResults, fpdsResults, grantsResults, dsbsResults, gsaResults] = await Promise.allSettled([
      // SAM.gov
      fetch(`${SAM_API_URL}?${samParams.toString()}`, {
        headers: {
          'Accept': 'application/json',
          'X-Api-Key': apiKey,
        }
      }).then(res => res.json()).then(data => 
        (data.opportunitiesData || []).map((opp: any) => ({
          id: opp.noticeId || crypto.randomUUID(),
          title: opp.title || 'Untitled Opportunity',
          description: opp.description || '',
          agency: opp.department || opp.subtier || null,
          type: opp.noticeType || 'Unknown',
          posted_date: opp.postedDate || null,
          naics_code: opp.naicsCode || null,
          set_aside: opp.setAside || null,
          response_due: opp.responseDeadLine || null,
          value: opp.estimatedTotalValue || null,
          source: 'SAM.gov'
        }))
      ).catch(error => {
        console.error('SAM.gov fetch error:', error)
        return []
      }),

      // FPDS
      fetch(`${FPDS_API_URL}?q=${searchTerm || ''}`).then(res => res.text())
        .then(text => {
          const matches = text.match(/<entry>(.*?)<\/entry>/gs) || []
          return matches.map(entry => ({
            id: entry.match(/<id>(.*?)<\/id>/)?.[1] || crypto.randomUUID(),
            title: entry.match(/<title>(.*?)<\/title>/)?.[1] || 'Untitled Contract',
            description: entry.match(/<content type="text">(.*?)<\/content>/)?.[1] || '',
            agency: null,
            type: 'Contract Award',
            posted_date: new Date().toISOString(),
            source: 'FPDS'
          }))
        }).catch(error => {
          console.error('FPDS fetch error:', error)
          return []
        }),

      // Grants.gov
      fetch(`${GRANTS_API_URL}?keyword=${searchTerm || ''}`).then(res => res.json())
        .then(data => (data.opportunities || []).map((grant: any) => ({
          id: grant.id || crypto.randomUUID(),
          title: grant.title || 'Untitled Grant',
          description: grant.description || '',
          agency: grant.agency || null,
          type: 'Grant',
          posted_date: grant.postDate || null,
          response_due: grant.closeDate || null,
          value: grant.awardCeiling || null,
          source: 'Grants.gov'
        }))).catch(error => {
          console.error('Grants.gov fetch error:', error)
          return []
        }),

      // DSBS
      fetch(`${DSBS_API_URL}?keyword=${searchTerm || ''}`).then(res => res.json())
        .then(data => (data.results || []).map((business: any) => ({
          id: business.dunsNumber || crypto.randomUUID(),
          title: business.firmName || 'Unnamed Business',
          description: business.description || '',
          type: 'Small Business',
          naics_code: business.primaryNaics || null,
          source: 'DSBS'
        }))).catch(error => {
          console.error('DSBS fetch error:', error)
          return []
        }),

      // GSA Advantage
      fetch(`${GSA_API_URL}?q=${searchTerm || ''}`).then(res => res.json())
        .then(data => (data.items || []).map((item: any) => ({
          id: item.contractNumber || crypto.randomUUID(),
          title: item.title || 'Untitled Item',
          description: item.description || '',
          agency: 'GSA',
          type: 'GSA Schedule',
          value: item.price || null,
          source: 'GSA Advantage'
        }))).catch(error => {
          console.error('GSA Advantage fetch error:', error)
          return []
        })
    ])

    // Combine results from all sources
    const allResults = [
      ...(samResults.status === 'fulfilled' ? samResults.value : []),
      ...(fpdsResults.status === 'fulfilled' ? fpdsResults.value : []),
      ...(grantsResults.status === 'fulfilled' ? grantsResults.value : []),
      ...(dsbsResults.status === 'fulfilled' ? dsbsResults.value : []),
      ...(gsaResults.status === 'fulfilled' ? gsaResults.value : [])
    ]

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