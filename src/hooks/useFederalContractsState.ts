import { useState, startTransition } from "react"
import { useContractsSearch } from "./useContractsSearch"

export function useFederalContractsState() {
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

  return {
    // Search state
    searchQuery,
    selectedAgency,
    noticeType,
    activeOnly,
    currentPage,
    dateRange,
    sortField,
    sortDirection,
    // Data
    contracts,
    isLoading,
    error,
    // Handlers
    handleSearchChange,
    handleAgencyChange,
    handleNoticeTypeChange,
    handleActiveOnlyChange,
    handleDateRangeChange,
    handlePageChange,
    onSort,
  }
}