import { Table, TableBody } from "@/components/ui/table"
import { FederalContractsTableHeader } from "./FederalContractsTableHeader"
import { FederalContractsTableRow } from "./FederalContractsTableRow"
import { TableProps } from "./types"

export function FederalContractsTableContent({
  contracts,
  sortField,
  sortDirection,
  onSort,
}: TableProps) {
  return (
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
  )
}