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
import { Skeleton } from "@/components/ui/skeleton"

interface ContractsTableProps {
  contracts: Contract[]
  isLoading?: boolean
}

export function ContractsTable({ 
  contracts,
  isLoading = false 
}: ContractsTableProps) {
  const { sortField, sortDirection, handleSort, sortData } = useTableSort()
  const sortedContracts = sortData(contracts)

  if (isLoading) {
    return (
      <Table>
        <ContractsTableHeader
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-48" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <Table>
      <ContractsTableHeader
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
      <TableBody>
        {sortedContracts.map((contract) => (
          <TableRow key={contract.id} className="hover:bg-muted/50 transition-colors">
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