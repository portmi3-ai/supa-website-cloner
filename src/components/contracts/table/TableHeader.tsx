import { TableHead, TableHeader as ShadcnTableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"
import { SortField, SortDirection } from "@/hooks/useTableSort"

interface ContractsTableHeaderProps {
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
}

export function ContractsTableHeader({ sortField, sortDirection, onSort }: ContractsTableHeaderProps) {
  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    )
  }

  return (
    <ShadcnTableHeader>
      <TableRow>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("contract_number")}
            className="hover:bg-transparent"
          >
            Contract Number
            {getSortIcon("contract_number")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("title")}
            className="hover:bg-transparent"
          >
            Title
            {getSortIcon("title")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("status")}
            className="hover:bg-transparent"
          >
            Status
            {getSortIcon("status")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("value")}
            className="hover:bg-transparent"
          >
            Value
            {getSortIcon("value")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("start_date")}
            className="hover:bg-transparent"
          >
            Start Date
            {getSortIcon("start_date")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("end_date")}
            className="hover:bg-transparent"
          >
            End Date
            {getSortIcon("end_date")}
          </Button>
        </TableHead>
      </TableRow>
    </ShadcnTableHeader>
  )
}