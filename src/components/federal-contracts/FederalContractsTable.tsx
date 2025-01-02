import { FederalContractsTableContainer } from "./table/FederalContractsTableContainer"

interface FederalContractsTableProps {
  contracts: Array<{
    id: string
    title: string
    agency: string
    type: string
    posted_date: string
    value: number
    response_due: string
    naics_code: string
    set_aside: string
  }>
  isLoading: boolean
  error?: Error | null
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  sortField: string
  sortDirection: 'asc' | 'desc'
  onSort: (field: string) => void
}

export function FederalContractsTable(props: FederalContractsTableProps) {
  return <FederalContractsTableContainer {...props} />
}