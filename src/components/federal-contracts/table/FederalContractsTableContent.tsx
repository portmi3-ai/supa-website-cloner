import { Table, TableBody } from "@/components/ui/table"
import { FederalContractsTableHeader } from "./FederalContractsTableHeader"
import { FederalContractsTableRow } from "./FederalContractsTableRow"

interface FederalContractsTableContentProps {
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
  sortField: string
  sortDirection: 'asc' | 'desc'
  onSort: (field: string) => void
}

export function FederalContractsTableContent({
  contracts,
  sortField,
  sortDirection,
  onSort,
}: FederalContractsTableContentProps) {
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