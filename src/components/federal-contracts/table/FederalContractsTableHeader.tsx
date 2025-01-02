import { Button } from "@/components/ui/button"
import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"

interface FederalContractsTableHeaderProps {
  sortField: string
  sortDirection: 'asc' | 'desc'
  onSort: (field: string) => void
}

export function FederalContractsTableHeader({
  sortField,
  sortDirection,
  onSort,
}: FederalContractsTableHeaderProps) {
  const getSortIcon = (field: string) => {
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
        <TableHead className="min-w-[400px]">
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
            onClick={() => onSort("agency")}
            className="hover:bg-transparent"
          >
            Agency
            {getSortIcon("agency")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("type")}
            className="hover:bg-transparent"
          >
            Type
            {getSortIcon("type")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("posted_date")}
            className="hover:bg-transparent"
          >
            Posted Date
            {getSortIcon("posted_date")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("naics_code")}
            className="hover:bg-transparent"
          >
            NAICS
            {getSortIcon("naics_code")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("set_aside")}
            className="hover:bg-transparent"
          >
            Set Aside
            {getSortIcon("set_aside")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("response_due")}
            className="hover:bg-transparent"
          >
            Response Due
            {getSortIcon("response_due")}
          </Button>
        </TableHead>
      </TableRow>
    </TableHeader>
  )
}