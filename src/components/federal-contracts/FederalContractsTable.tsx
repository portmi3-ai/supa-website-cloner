import {
  Table,
  TableBody,
} from "@/components/ui/table"
import { FederalContractsTableHeader } from "./table/FederalContractsTableHeader"
import { FederalContractsLoadingState } from "./table/FederalContractsLoadingState"
import { FederalContractsEmptyState } from "./table/FederalContractsEmptyState"
import { FederalContractsPagination } from "./table/FederalContractsPagination"
import { FederalContractsTableRow } from "./table/FederalContractsTableRow"

interface FederalContract {
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

interface FederalContractsTableProps {
  contracts: FederalContract[]
  isLoading: boolean
  error?: Error | null
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  sortField: string
  sortDirection: 'asc' | 'desc'
  onSort: (field: string) => void
}

export function FederalContractsTable({
  contracts,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  sortField,
  sortDirection,
  onSort,
}: FederalContractsTableProps) {
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
        <Table>
          <FederalContractsTableHeader
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          />
          <TableBody className="relative">
            {contracts.map((contract) => (
              <FederalContractsTableRow key={contract.id} contract={contract} />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center">
        <FederalContractsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}