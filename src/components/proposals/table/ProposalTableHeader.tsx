import { Button } from "@/components/ui/button"
import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"
import { SortDirection, SortField } from "./types"

interface ProposalTableHeaderProps {
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
}

export function ProposalTableHeader({
  sortField,
  sortDirection,
  onSort,
}: ProposalTableHeaderProps) {
  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    )
  }

  return (
    <TableHeader>
      <TableRow>
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
            onClick={() => onSort("funding_agency")}
            className="hover:bg-transparent"
          >
            Funding Agency
            {getSortIcon("funding_agency")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("funding_amount")}
            className="hover:bg-transparent"
          >
            Amount
            {getSortIcon("funding_amount")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("submission_deadline")}
            className="hover:bg-transparent"
          >
            Deadline
            {getSortIcon("submission_deadline")}
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
      </TableRow>
    </TableHeader>
  )
}