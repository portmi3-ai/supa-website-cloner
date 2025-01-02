import { TableHead, TableHeader, TableRow, Table } from "@/components/ui/table"

export function FederalContractsLoadingState() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead colSpan={5} className="h-24 text-center">
            Loading contracts...
          </TableHead>
        </TableRow>
      </TableHeader>
    </Table>
  )
}