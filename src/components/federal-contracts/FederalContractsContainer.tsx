import { FederalContractsHeader } from "./sections/FederalContractsHeader"
import { FederalContractsControls } from "./sections/FederalContractsControls"
import { FederalContractsResults } from "./sections/FederalContractsResults"
import { useContractsSearch } from "@/hooks/useContractsSearch"

export function FederalContractsContainer() {
  const {
    searchQuery,
    setSearchQuery,
    selectedAgency,
    setSelectedAgency,
    noticeType,
    setNoticeType,
    activeOnly,
    setActiveOnly,
    currentPage,
    setCurrentPage,
    dateRange,
    setDateRange,
    sortField,
    sortDirection,
    onSort,
    contracts,
    isLoading,
    error,
  } = useContractsSearch()

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