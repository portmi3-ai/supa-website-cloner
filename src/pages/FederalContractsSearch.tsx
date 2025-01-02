import { useState } from "react"
import { FederalContractsSearchBar } from "@/components/federal-contracts/FederalContractsSearchBar"
import { FederalContractsFilters } from "@/components/federal-contracts/FederalContractsFilters"
import { FederalContractsTable } from "@/components/federal-contracts/FederalContractsTable"

export function FederalContractsSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAgency, setSelectedAgency] = useState("all")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  return (
    <div className="container space-y-6 py-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Federal Contracts Search</h2>
        <p className="text-muted-foreground">
          Search and filter federal contract opportunities
        </p>
      </div>
      <div className="space-y-4">
        <FederalContractsSearchBar value={searchQuery} onChange={setSearchQuery} />
        <FederalContractsFilters
          selectedAgency={selectedAgency}
          onAgencyChange={setSelectedAgency}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <FederalContractsTable />
      </div>
    </div>
  )
}