import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Proposal } from "@/types/proposals.types"
import { ProposalStatusBadge } from "./ProposalStatusBadge"
import { format } from "date-fns"
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ProposalsTableProps {
  proposals: Proposal[]
  isLoading?: boolean
}

type SortField = "title" | "funding_agency" | "funding_amount" | "submission_deadline" | "status"
type SortDirection = "asc" | "desc"

export function ProposalsTable({ proposals, isLoading }: ProposalsTableProps) {
  const [sortField, setSortField] = useState<SortField>("title")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    )
  }

  const sortedProposals = [...proposals].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1
    
    switch (sortField) {
      case "title":
        return (a.title > b.title ? 1 : -1) * direction
      case "funding_agency":
        return ((a.funding_agency || "") > (b.funding_agency || "") ? 1 : -1) * direction
      case "funding_amount":
        return ((a.funding_amount || 0) > (b.funding_amount || 0) ? 1 : -1) * direction
      case "submission_deadline":
        return ((a.submission_deadline || "") > (b.submission_deadline || "") ? 1 : -1) * direction
      case "status":
        return ((a.status || "") > (b.status || "") ? 1 : -1) * direction
      default:
        return 0
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort("title")}
              className="hover:bg-transparent"
            >
              Title
              {getSortIcon("title")}
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort("funding_agency")}
              className="hover:bg-transparent"
            >
              Funding Agency
              {getSortIcon("funding_agency")}
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort("funding_amount")}
              className="hover:bg-transparent"
            >
              Amount
              {getSortIcon("funding_amount")}
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort("submission_deadline")}
              className="hover:bg-transparent"
            >
              Deadline
              {getSortIcon("submission_deadline")}
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort("status")}
              className="hover:bg-transparent"
            >
              Status
              {getSortIcon("status")}
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedProposals.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              No results found. Try adjusting your search criteria.
            </TableCell>
          </TableRow>
        ) : (
          sortedProposals.map((proposal) => (
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
          ))
        )}
      </TableBody>
    </Table>
  )
}