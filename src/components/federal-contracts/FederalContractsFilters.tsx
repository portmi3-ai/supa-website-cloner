import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { SaveSearchDialog } from "./filters/SaveSearchDialog"
import { AdvancedFiltersSheet } from "./filters/AdvancedFiltersSheet"

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
        <Select value={selectedAgency} onValueChange={onAgencyChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select agency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Agencies</SelectItem>
            <SelectItem value="DOD">Department of Defense</SelectItem>
            <SelectItem value="NASA">NASA</SelectItem>
            <SelectItem value="DOE">Department of Energy</SelectItem>
            <SelectItem value="HHS">Health and Human Services</SelectItem>
          </SelectContent>
        </Select>

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