import { useState } from "react"
import { useFederalContractsSearch } from "./useFederalContractsSearch"
import { useSortableTable } from "@/components/federal-contracts/hooks/useSortableTable"

export function useContractsSearch() {
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

  // Clean up undefined values and format dates
  const cleanParams = {
    searchTerm: searchQuery || '*', // Always provide a search term, use '*' as default
    agency: selectedAgency === "all" ? undefined : selectedAgency,
    startDate: dateRange.from,
    endDate: dateRange.to,
    noticeType: noticeType === "all" ? undefined : noticeType,
    activeOnly,
    page: currentPage - 1, // API uses 0-based indexing
    sortField,
    sortDirection,
  }

  const { data: contracts, isLoading, error } = useFederalContractsSearch(cleanParams)

  return {
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
  }
}