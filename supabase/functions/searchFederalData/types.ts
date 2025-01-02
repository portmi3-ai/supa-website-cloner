export interface SearchParams {
  searchTerm: string
  agency?: string
  startDate?: string
  endDate?: string
  contractType?: string
  page?: number
  limit?: number
}

export interface FederalDataResult {
  id: string
  title: string
  description?: string
  funding_agency?: string | null
  funding_amount?: number | null
  submission_deadline?: string | null
  status?: string
  source: string
  entity_type?: string | null
  location?: string | null
  registration_status?: string | null
  award_type?: string | null
  recipient_name?: string | null
  award_date?: string | null
  contract_type?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  totalPages: number
  currentPage: number
  totalRecords: number
}