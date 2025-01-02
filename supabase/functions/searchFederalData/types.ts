export interface SearchParams {
  searchTerm?: string
  agency?: string
  startDate?: string
  endDate?: string
  noticeType?: string
  activeOnly?: boolean
  page?: number
  limit?: number
  sortField?: string
  sortDirection?: 'asc' | 'desc'
}

export interface FederalDataResult {
  id: string
  title: string
  agency?: string
  type?: string
  posted_date?: string
  value?: number
  response_due?: string
  naics_code?: string
  set_aside?: string | null
  source?: string
}