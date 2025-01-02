import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"

interface FederalContractsFiltersProps {
  selectedAgency: string
  onAgencyChange: (value: string) => void
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
}

export function FederalContractsFilters({
  selectedAgency,
  onAgencyChange,
  dateRange,
  onDateRangeChange,
}: FederalContractsFiltersProps) {
  return (
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

      <DatePickerWithRange
        date={dateRange}
        onDateChange={onDateRangeChange}
      />

      <Button variant="outline" className="ml-auto">
        Advanced Filters
      </Button>
    </div>
  )
}