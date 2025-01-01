import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Contract } from "@/types/contracts.types"
import { ContractStatusBadge } from "./ContractStatusBadge"
import { format } from "date-fns"

interface ContractsTableProps {
  contracts: Contract[]
}

export function ContractsTable({ contracts }: ContractsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contract Number</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contracts.map((contract) => (
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