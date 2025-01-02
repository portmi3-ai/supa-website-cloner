import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { SaveSearchDialog } from "./filters/SaveSearchDialog"
import { AdvancedFiltersSheet } from "./filters/AdvancedFiltersSheet"
import { AgencySelect } from "./filters/AgencySelect"

interface FederalContractsFiltersProps {
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
  searchTerm: string
  noticeType: string
  onNoticeTypeChange: (value: string) => void
  activeOnly: boolean
  onActiveOnlyChange: (value: boolean) => void
}

export function FederalContractsFilters({
  selectedAgency,
  onAgencyChange,
  dateRange,
  onDateRangeChange,
  searchTerm,
  noticeType,
  onNoticeTypeChange,
  activeOnly,
  onActiveOnlyChange,
}: FederalContractsFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <AgencySelect value={selectedAgency} onChange={onAgencyChange} />
        <DatePickerWithRange date={dateRange} onDateChange={onDateRangeChange} />
        <AdvancedFiltersSheet
          noticeType={noticeType}
          onNoticeTypeChange={onNoticeTypeChange}
          activeOnly={activeOnly}
          onActiveOnlyChange={onActiveOnlyChange}
        />
        <SaveSearchDialog
          searchCriteria={{
            searchTerm,
            agency: selectedAgency,
            dateRange,
            noticeType,
            activeOnly,
          }}
        />
      </div>
    </div>
  )
}