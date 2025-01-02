import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { FederalContractsTableHeader } from "./FederalContractsTableHeader"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FederalContractsEmptyStateProps {
  sortField: string
  sortDirection: 'asc' | 'desc'
  onSort: (field: string) => void
  error?: Error | null
}

export function FederalContractsEmptyState({
  sortField,
  sortDirection,
  onSort,
  error
}: FederalContractsEmptyStateProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error.message || "Failed to fetch contracts. Please try again later."}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Table>
      <FederalContractsTableHeader
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
      />
      <TableBody>
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}