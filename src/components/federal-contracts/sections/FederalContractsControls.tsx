import { FederalContractsSearchBar } from "../FederalContractsSearchBar"
import { FederalContractsFilters } from "../FederalContractsFilters"

interface FederalContractsControlsProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedAgency: string
  onAgencyChange: (value: string) => void
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  onDateRangeChange: (range: {
    from: Date | undefined
    to: Date | undefined
  }) => void
  noticeType: string
  onNoticeTypeChange: (value: string) => void
  activeOnly: boolean
  onActiveOnlyChange: (value: boolean) => void
}

export function FederalContractsControls({
  searchQuery,
  onSearchChange,
  selectedAgency,
  onAgencyChange,
  dateRange,
  onDateRangeChange,
  noticeType,
  onNoticeTypeChange,
  activeOnly,
  onActiveOnlyChange,
}: FederalContractsControlsProps) {
  return (
    <div className="space-y-4">
      <FederalContractsSearchBar value={searchQuery} onChange={onSearchChange} />
      <FederalContractsFilters
        selectedAgency={selectedAgency}
        onAgencyChange={onAgencyChange}
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        searchTerm={searchQuery}
        noticeType={noticeType}
        onNoticeTypeChange={onNoticeTypeChange}
        activeOnly={activeOnly}
        onActiveOnlyChange={onActiveOnlyChange}
      />
    </div>
  )
}