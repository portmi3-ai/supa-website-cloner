import { Table } from "@/components/ui/table"
import { Proposal } from "@/types/proposals.types"
import { ProposalTableHeader } from "./table/ProposalTableHeader"
import { ProposalTableBody } from "./table/ProposalTableBody"
import { useProposalSort } from "./table/useProposalSort"

interface ProposalsTableProps {
  proposals: Proposal[]
  isLoading?: boolean
}

export function ProposalsTable({ proposals, isLoading }: ProposalsTableProps) {
  const { sortField, sortDirection, handleSort, sortedProposals } = useProposalSort(proposals)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <Table>
      <ProposalTableHeader
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
      <ProposalTableBody proposals={sortedProposals} />
    </Table>
  )
}