export interface FederalContract {
  id: string
  title: string
  agency: string
  type: string
  posted_date: string
  value: number
  response_due: string
  naics_code: string
  set_aside: string
}

export interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

export interface TableProps {
  contracts: FederalContract[]
  sortField: string
  sortDirection: 'asc' | 'desc'
  onSort: (field: string) => void
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}