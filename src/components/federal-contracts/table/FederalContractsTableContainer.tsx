import { FederalContractsTableContent } from "./FederalContractsTableContent"
import { FederalContractsLoadingState } from "./FederalContractsLoadingState"
import { FederalContractsEmptyState } from "./FederalContractsEmptyState"
import { FederalContractsPagination } from "./FederalContractsPagination"

interface FederalContractsTableContainerProps {
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

export function FederalContractsTableContainer({
  contracts,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  sortField,
  sortDirection,
  onSort,
}: FederalContractsTableContainerProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border border-border/50 backdrop-blur-sm animate-pulse">
        <FederalContractsLoadingState />
      </div>
    )
  }

  if (error || !contracts?.length) {
    return (
      <div className="rounded-md border border-border/50 backdrop-blur-sm animate-fade-in">
        <FederalContractsEmptyState
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
          error={error}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-scale-in">
      <div className="rounded-md border border-border/50 backdrop-blur-sm overflow-hidden glass-card">
        <div className="min-w-[800px]">
          <FederalContractsTableContent
            contracts={contracts}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          />
        </div>
      </div>

      <div className="flex justify-center py-4">
        <FederalContractsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}