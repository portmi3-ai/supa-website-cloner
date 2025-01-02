import { useState } from "react"
import { FederalContractsSearchBar } from "@/components/federal-contracts/FederalContractsSearchBar"
import { FederalContractsFilters } from "@/components/federal-contracts/FederalContractsFilters"
import { FederalContractsTable } from "@/components/federal-contracts/FederalContractsTable"
import { useFederalContractsSearch } from "@/hooks/useFederalContractsSearch"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export function FederalContractsSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAgency, setSelectedAgency] = useState("all")
  const [noticeType, setNoticeType] = useState("all")
  const [activeOnly, setActiveOnly] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState("posted_date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const { data: contracts, isLoading } = useFederalContractsSearch({
    searchTerm: searchQuery,
    agency: selectedAgency === "all" ? undefined : selectedAgency,
    startDate: dateRange.from,
    endDate: dateRange.to,
    noticeType: noticeType === "all" ? undefined : noticeType,
    activeOnly,
    page: currentPage,
    sortField,
    sortDirection,
  })

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="container space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Federal Contracts Search
          </h2>
          <p className="text-muted-foreground">
            Search and filter federal contract opportunities
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Bell className="mr-2 h-4 w-4" />
          Notify Me Daily
        </Button>
      </div>
      <div className="space-y-4">
        <FederalContractsSearchBar value={searchQuery} onChange={setSearchQuery} />
        <FederalContractsFilters
          selectedAgency={selectedAgency}
          onAgencyChange={setSelectedAgency}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          searchTerm={searchQuery}
          noticeType={noticeType}
          onNoticeTypeChange={setNoticeType}
          activeOnly={activeOnly}
          onActiveOnlyChange={setActiveOnly}
        />
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {contracts?.length || 0} results found
          </div>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
        <FederalContractsTable
          contracts={contracts || []}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={Math.ceil((contracts?.length || 0) / 10)}
          onPageChange={setCurrentPage}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>
    </div>
  )
}