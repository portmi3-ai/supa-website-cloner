import { Proposal } from "@/types/proposals.types"
import { useState, useMemo } from "react"
import { SortDirection, SortField } from "./types"

export function useProposalSort(proposals: Proposal[]) {
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

  const sortedProposals = useMemo(() => {
    return [...proposals].sort((a, b) => {
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
  }, [proposals, sortField, sortDirection])

  return {
    sortField,
    sortDirection,
    handleSort,
    sortedProposals,
  }
}