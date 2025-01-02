import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { Contract } from "@/types/contracts.types"
import { ContractStatusBadge } from "./ContractStatusBadge"
import { format } from "date-fns"
import { useTableSort } from "@/hooks/useTableSort"
import { ContractsTableHeader } from "./table/TableHeader"

interface ContractsTableProps {
  contracts: Contract[]
}

export function ContractsTable({ contracts }: ContractsTableProps) {
  const { sortField, sortDirection, handleSort, sortData } = useTableSort()
  const sortedContracts = sortData(contracts)

  return (
    <Table>
      <ContractsTableHeader
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
      <TableBody>
        {sortedContracts.map((contract) => (
          <TableRow key={contract.id}>
            <TableCell>{contract.contract_number || "N/A"}</TableCell>
            <TableCell>{contract.title}</TableCell>
            <TableCell>
              <ContractStatusBadge status={contract.status} />
            </TableCell>
            <TableCell>
              {contract.value
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(contract.value)
                : "N/A"}
            </TableCell>
            <TableCell>
              {contract.start_date
                ? format(new Date(contract.start_date), "MMM d, yyyy")
                : "N/A"}
            </TableCell>
            <TableCell>
              {contract.end_date
                ? format(new Date(contract.end_date), "MMM d, yyyy")
                : "N/A"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}