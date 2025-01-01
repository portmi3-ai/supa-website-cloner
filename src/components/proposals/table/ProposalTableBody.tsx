import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Proposal } from "@/types/proposals.types"
import { format } from "date-fns"
import { ProposalStatusBadge } from "../ProposalStatusBadge"

interface ProposalTableBodyProps {
  proposals: Proposal[]
}

export function ProposalTableBody({ proposals }: ProposalTableBodyProps) {
  if (proposals.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="text-center py-8">
            No results found. Try adjusting your search criteria.
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {proposals.map((proposal) => (
        <TableRow key={proposal.id}>
          <TableCell>{proposal.title}</TableCell>
          <TableCell>{proposal.funding_agency || "N/A"}</TableCell>
          <TableCell>
            {proposal.funding_amount
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(proposal.funding_amount)
              : "N/A"}
          </TableCell>
          <TableCell>
            {proposal.submission_deadline
              ? format(new Date(proposal.submission_deadline), "MMM d, yyyy")
              : "N/A"}
          </TableCell>
          <TableCell>
            <ProposalStatusBadge status={proposal.status} />
          </TableCell>
        </TableRow>
      </TableBody>
    )
  )
}