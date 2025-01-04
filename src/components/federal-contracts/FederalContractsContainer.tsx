import { useEffect, startTransition } from "react"
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

  // Wrap state updates in startTransition to prevent suspension during synchronous updates
  const handleSearchChange = (value: string) => {
    startTransition(() => {
      setSearchQuery(value)
      setCurrentPage(1)
    })
  }

  const handleAgencyChange = (value: string) => {
    startTransition(() => {
      setSelectedAgency(value)
      setCurrentPage(1)
    })
  }

  const handleNoticeTypeChange = (value: string) => {
    startTransition(() => {
      setNoticeType(value)
      setCurrentPage(1)
    })
  }

  const handleActiveOnlyChange = (value: boolean) => {
    startTransition(() => {
      setActiveOnly(value)
      setCurrentPage(1)
    })
  }

  const handleDateRangeChange = (value: { from: Date | undefined; to: Date | undefined }) => {
    startTransition(() => {
      setDateRange(value)
      setCurrentPage(1)
    })
  }

  const handlePageChange = (page: number) => {
    startTransition(() => {
      setCurrentPage(page)
    })
  }

  return (
    <div className="space-y-6 h-full flex flex-col max-w-[100%]">
      <div className="search-container">
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