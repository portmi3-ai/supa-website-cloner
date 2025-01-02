import { FederalContractsHeader } from "./sections/FederalContractsHeader"
import { FederalContractsControls } from "./sections/FederalContractsControls"
import { FederalContractsResults } from "./sections/FederalContractsResults"
import { useState } from "react"
import { useFederalContractsSearch } from "@/hooks/useFederalContractsSearch"
import { useSortableTable } from "./hooks/useSortableTable"

export function FederalContractsContainer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAgency, setSelectedAgency] = useState("all")
  const [noticeType, setNoticeType] = useState("all")
  const [activeOnly, setActiveOnly] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const { sortField, sortDirection, onSort } = useSortableTable()

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

  return (
    <div className="container space-y-8 py-8">
      <div className="search-container glow-effect floating">
        <FederalContractsHeader />
        <div className="mt-6 animate-fade-in">
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
        </div>
      </div>
      
      <div className="results-table animate-scale-in">
        <FederalContractsResults
          contracts={contracts?.data || []}
          isLoading={isLoading}
          error={error}
          currentPage={currentPage}
          totalPages={contracts?.totalPages || 1}
          onPageChange={setCurrentPage}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
          totalRecords={contracts?.totalRecords || 0}
        />
      </div>
    </div>
  )
}