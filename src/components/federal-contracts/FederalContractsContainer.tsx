import { FederalContractsHeader } from "./sections/FederalContractsHeader"
import { FederalContractsControls } from "./sections/FederalContractsControls"
import { FederalContractsResults } from "./sections/FederalContractsResults"
import { useState } from "react"
import { useFederalContractsSearch } from "@/hooks/useFederalContractsSearch"

export function FederalContractsContainer() {
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

  const { data: contracts, isLoading, error } = useFederalContractsSearch({
    searchTerm: searchQuery,
    agency: selectedAgency === "all" ? undefined : selectedAgency,
    startDate: dateRange.from,
    endDate: dateRange.to,
    noticeType: noticeType === "all" ? undefined : noticeType,
    activeOnly,
    page: currentPage - 1,
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
      <FederalContractsHeader />
      <FederalContractsControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedAgency={selectedAgency}
        onAgencyChange={setSelectedAgency}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        noticeType={noticeType}
        onNoticeTypeChange={setNoticeType}
        activeOnly={activeOnly}
        onActiveOnlyChange={setActiveOnly}
      />
      <FederalContractsResults
        contracts={contracts?.data || []}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        totalPages={contracts?.totalPages || 1}
        onPageChange={setCurrentPage}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        totalRecords={contracts?.totalRecords || 0}
      />
    </div>
  )
}