import { useEffect } from "react"
import { FederalContractsHeader } from "./sections/FederalContractsHeader"
import { FederalContractsControls } from "./sections/FederalContractsControls"
import { FederalContractsResults } from "./sections/FederalContractsResults"
import { useFederalContractsState } from "@/hooks/useFederalContractsState"
import { useToast } from "@/hooks/use-toast"

export function FederalContractsContainer() {
  const { toast } = useToast()
  const {
    searchQuery,
    selectedAgency,
    noticeType,
    activeOnly,
    currentPage,
    dateRange,
    sortField,
    sortDirection,
    contracts,
    isLoading,
    error,
    handleSearchChange,
    handleAgencyChange,
    handleNoticeTypeChange,
    handleActiveOnlyChange,
    handleDateRangeChange,
    handlePageChange,
    onSort,
  } = useFederalContractsState()

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contracts. Please try again.",
        variant: "destructive",
      })
    }
  }, [error, toast])

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      <div className="search-container w-full">
        <FederalContractsHeader />
        <div className="mt-6">
          <FederalContractsControls
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedAgency={selectedAgency}
            onAgencyChange={handleAgencyChange}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            noticeType={noticeType}
            onNoticeTypeChange={handleNoticeTypeChange}
            activeOnly={activeOnly}
            onActiveOnlyChange={handleActiveOnlyChange}
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
          onPageChange={handlePageChange}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
          totalRecords={contracts?.totalRecords || 0}
        />
      </div>
    </div>
  )
}