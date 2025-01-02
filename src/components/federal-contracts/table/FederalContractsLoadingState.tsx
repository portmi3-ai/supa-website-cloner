import { TableHead, TableHeader, TableRow, Table } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function FederalContractsLoadingState() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-full">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
    </Table>
  )
}