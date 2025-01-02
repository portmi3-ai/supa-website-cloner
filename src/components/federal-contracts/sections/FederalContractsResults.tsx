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
      <div className="flex items-center justify-between p-4 glass-card backdrop-blur-md border border-white/10">
        <div className="text-sm">
          <span className="text-muted-foreground">Found </span>
          <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            {totalRecords.toLocaleString()}
          </span>
          <span className="text-muted-foreground"> results</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="cyber-button group relative overflow-hidden"
        >
          <span className="relative z-10 group-hover:text-white transition-colors">
            Export Results
          </span>
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