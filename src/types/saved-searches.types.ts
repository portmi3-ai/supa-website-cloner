export interface SavedSearchCriteria {
  searchTerm?: string
  agency?: string
  dateRange?: {
    from: string | null
    to: string | null
  }
  noticeType?: string
  activeOnly?: boolean
}

export interface SavedSearch {
  id: string
  user_id: string
  name: string
  search_criteria: SavedSearchCriteria
  created_at?: string
  updated_at?: string
}