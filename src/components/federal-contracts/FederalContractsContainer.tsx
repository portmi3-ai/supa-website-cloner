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

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contracts. Please try again.",
        variant: "destructive",
      })
    }
  }, [error, toast])

  // Reset to first page when search criteria changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedAgency, noticeType, activeOnly, dateRange, setCurrentPage])

  return (
    <div className="container max-w-full space-y-8 py-4 md:py-8">
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
            isLoading={isLoading}
          />
        </div>
      </div>
      
      <div className="results-table animate-scale-in overflow-hidden">
        <div className="overflow-x-auto">
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
    </div>
  )
}