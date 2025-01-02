import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SortButton } from "./SortButton"

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
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-[400px]">
          <SortButton
            field="title"
            currentSortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          >
            Title
          </SortButton>
        </TableHead>
        <TableHead>
          <SortButton
            field="agency"
            currentSortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          >
            Agency
          </SortButton>
        </TableHead>
        <TableHead>
          <SortButton
            field="type"
            currentSortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          >
            Type
          </SortButton>
        </TableHead>
        <TableHead>
          <SortButton
            field="posted_date"
            currentSortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          >
            Posted Date
          </SortButton>
        </TableHead>
        <TableHead>
          <SortButton
            field="naics_code"
            currentSortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          >
            NAICS
          </SortButton>
        </TableHead>
        <TableHead>
          <SortButton
            field="set_aside"
            currentSortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          >
            Set Aside
          </SortButton>
        </TableHead>
        <TableHead>
          <SortButton
            field="response_due"
            currentSortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          >
            Response Due
          </SortButton>
        </TableHead>
      </TableRow>
    </TableHeader>
  )
}