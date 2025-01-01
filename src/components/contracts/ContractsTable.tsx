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
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ContractsTableProps {
  contracts: Contract[]
}

type SortField = "contract_number" | "title" | "status" | "value" | "start_date" | "end_date"
type SortDirection = "asc" | "desc"

export function ContractsTable({ contracts }: ContractsTableProps) {
  const [sortField, setSortField] = useState<SortField>("contract_number")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    )
  }

  const sortedContracts = [...contracts].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1
    
    switch (sortField) {
      case "contract_number":
        return (
          ((a.contract_number || "") > (b.contract_number || "") ? 1 : -1) *
          direction
        )
      case "title":
        return (a.title > b.title ? 1 : -1) * direction
      case "status":
        return ((a.status || "") > (b.status || "") ? 1 : -1) * direction
      case "value":
        return (
          ((a.value || 0) > (b.value || 0) ? 1 : -1) * direction
        )
      case "start_date":
        return (
          ((a.start_date || "") > (b.start_date || "") ? 1 : -1) * direction
        )
      case "end_date":
        return (
          ((a.end_date || "") > (b.end_date || "") ? 1 : -1) * direction
        )
      default:
        return 0
    }
  })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort("contract_number")}
              className="hover:bg-transparent"
            >
              Contract Number
              {getSortIcon("contract_number")}
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort("title")}
              className="hover:bg-transparent"
            >
              Title
              {getSortIcon("title")}
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort("status")}
              className="hover:bg-transparent"
            >
              Status
              {getSortIcon("status")}
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort("value")}
              className="hover:bg-transparent"
            >
              Value
              {getSortIcon("value")}
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort("start_date")}
              className="hover:bg-transparent"
            >
              Start Date
              {getSortIcon("start_date")}
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort("end_date")}
              className="hover:bg-transparent"
            >
              End Date
              {getSortIcon("end_date")}
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
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