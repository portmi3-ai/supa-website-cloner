import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { format, isValid, parseISO } from "date-fns"

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

interface FederalContractsTableRowProps {
  contract: FederalContract
}

export function FederalContractsTableRow({ contract }: FederalContractsTableRowProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A"
    const parsedDate = parseISO(dateString)
    return isValid(parsedDate) ? format(parsedDate, "MMM d, yyyy") : "Invalid Date"
  }

  return (
    <TableRow className="group">
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
      <TableCell>{formatDate(contract.posted_date)}</TableCell>
      <TableCell>{contract.naics_code}</TableCell>
      <TableCell>{contract.set_aside || "N/A"}</TableCell>
      <TableCell>{formatDate(contract.response_due)}</TableCell>
    </TableRow>
  )
}