import { SearchParams, FederalDataResult } from '../types.ts'

const USA_SPENDING_API_URL = "https://api.usaspending.gov/api/v2/search/spending_by_award/"

export async function fetchUSASpendingData(params: SearchParams): Promise<FederalDataResult[]> {
  console.log('Fetching USASpending.gov data...')
  try {
    const requestBody = {
      filters: {
        keywords: [params.searchTerm],
        time_period: [
          {
            start_date: params.startDate || "2020-01-01",
            end_date: params.endDate || new Date().toISOString().split('T')[0]
          }
        ],
        award_type_codes: ["A", "B", "C", "D"]
      },
      page: params.page || 1,
      limit: params.limit || 20,
      sort: "obligated_amount",
      order: "desc"
    }

    const response = await fetch(USA_SPENDING_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`USASpending.gov API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('USASpending.gov results count:', data.results?.length || 0)
    
    return (data.results || []).map((award: any) => ({
      id: award.generated_internal_id || crypto.randomUUID(),
      title: award.recipient_name || 'Unnamed Award',
      description: award.description || '',
      funding_agency: award.awarding_agency_name || null,
      funding_amount: award.obligated_amount || null,
      submission_deadline: null,
      status: award.status || 'unknown',
      source: 'USASpending.gov',
      award_type: award.type || null,
      recipient_name: award.recipient_name || null,
      award_date: award.period_of_performance_start_date || null
    }))
  } catch (error) {
    console.error('USASpending.gov fetch error:', error)
    return []
  }
}