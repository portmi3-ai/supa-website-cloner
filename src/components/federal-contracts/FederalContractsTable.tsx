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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

interface FederalContract {
  id: string
  title: string
  agency: string
  type: string
  posted_date: string
  value: number
  response_due: string
  naics_code: string
  set_aside: string
}

interface FederalContractsTableProps {
  contracts: FederalContract[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  sortField: string
  sortDirection: 'asc' | 'desc'
  onSort: (field: string) => void
}

export function FederalContractsTable({
  contracts,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  sortField,
  sortDirection,
  onSort,
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

  const renderPaginationItems = () => {
    const items = []
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => onPageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        items.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
    }
    return items
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <FederalContractsTableHeader
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          />
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id} className="group">
                <TableCell className="max-w-xl">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between">
                      <div className="font-medium">{contract.title}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ID: {contract.id}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{contract.agency}</TableCell>
                <TableCell>{contract.type}</TableCell>
                <TableCell>
                  {format(new Date(contract.posted_date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  {contract.naics_code}
                </TableCell>
                <TableCell>
                  {contract.set_aside || "N/A"}
                </TableCell>
                <TableCell>
                  {format(new Date(contract.response_due), "MMM d, yyyy")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              className={
                currentPage === totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}