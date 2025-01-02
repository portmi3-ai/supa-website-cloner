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
  currentPage,
  totalPages,
  onPageChange,
  sortField,
  sortDirection,
  onSort,
}: FederalContractsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <FederalContractsLoadingState />
      </div>
    )
  }

  if (!contracts?.length) {
    return (
      <div className="rounded-md border">
        <FederalContractsEmptyState
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <FederalContractsTableHeader
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          />
          <TableBody>
            {contracts.map((contract) => (
              <FederalContractsTableRow key={contract.id} contract={contract} />
            ))}
          </TableBody>
        </Table>
      </div>

      <FederalContractsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}