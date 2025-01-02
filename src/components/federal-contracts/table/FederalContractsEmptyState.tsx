import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { FederalContractsTableHeader } from "./FederalContractsTableHeader"

interface FederalContractsEmptyStateProps {
  sortField: string
  sortDirection: 'asc' | 'desc'
  onSort: (field: string) => void
}

export function FederalContractsEmptyState({
  sortField,
  sortDirection,
  onSort,
}: FederalContractsEmptyStateProps) {
  return (
    <Table>
      <FederalContractsTableHeader
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
      />
      <TableBody>
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            No results found. Try adjusting your search criteria.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}