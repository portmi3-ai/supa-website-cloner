import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { FederalContractsTableHeader } from "./FederalContractsTableHeader"

export function FederalContractsEmptyState() {
  return (
    <Table>
      <FederalContractsTableHeader />
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="h-24 text-center">
            No results found. Try adjusting your search criteria.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}