import { ProposalsSearch } from "./ProposalsSearch"

interface ProposalsHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function ProposalsHeader({ searchQuery, onSearchChange }: ProposalsHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="text-3xl font-bold">Federal, State & Local Opportunities</h1>
      <div className="w-full md:w-96">
        <ProposalsSearch value={searchQuery} onChange={onSearchChange} />
      </div>
    </div>
  )
}