import { useEffect } from "react"
import { FederalContractsHeader } from "./sections/FederalContractsHeader"
import { FederalContractsControls } from "./sections/FederalContractsControls"
import { FederalContractsResults } from "./sections/FederalContractsResults"
import { useContractsSearch } from "@/hooks/useContractsSearch"
import { useToast } from "@/hooks/use-toast"

export function FederalContractsContainer() {
  const { toast } = useToast()
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

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contracts. Please try again.",
        variant: "destructive",
      })
    }
  }, [error, toast])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedAgency, noticeType, activeOnly, dateRange, setCurrentPage])

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="search-container">
        <FederalContractsHeader />
        <div className="mt-6">
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
            isLoading={isLoading}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col">
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