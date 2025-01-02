import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { FederalContractsTableHeader } from "./table/FederalContractsTableHeader"
import { FederalContractsLoadingState } from "./table/FederalContractsLoadingState"
import { FederalContractsEmptyState } from "./table/FederalContractsEmptyState"

interface FederalContract {
  id: string
  title: string
  agency: string
  type: string
  posted_date: string
  value: number
}

interface FederalContractsTableProps {
  contracts: FederalContract[]
  isLoading: boolean
}

export function FederalContractsTable({
  contracts,
  isLoading,
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
        <FederalContractsEmptyState />
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <FederalContractsTableHeader />
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell>{contract.title}</TableCell>
              <TableCell>{contract.agency}</TableCell>
              <TableCell>{contract.type}</TableCell>
              <TableCell>
                {format(new Date(contract.posted_date), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(contract.value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}