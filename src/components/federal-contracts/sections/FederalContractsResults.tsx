import { Button } from "@/components/ui/button"
import { FederalContractsTable } from "../FederalContractsTable"

interface FederalContractsResultsProps {
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
  totalRecords: number
}

export function FederalContractsResults({
  contracts,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  sortField,
  sortDirection,
  onSort,
  totalRecords,
}: FederalContractsResultsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 glass-card">
        <div className="text-sm text-muted-foreground">
          {totalRecords} results found
        </div>
        <Button variant="outline" size="sm" className="cyber-button">
          Export
        </Button>
      </div>
      <FederalContractsTable
        contracts={contracts}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
      />
    </div>
  )
}