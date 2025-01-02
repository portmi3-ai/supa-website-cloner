import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"

interface ProposalsFiltersProps {
  selectedAgency: string
  onAgencyChange: (value: string) => void
  startDate: Date | undefined
  onStartDateSelect: (date: Date | undefined) => void
  endDate: Date | undefined
  onEndDateSelect: (date: Date | undefined) => void
}

export function ProposalsFilters({
  selectedAgency,
  onAgencyChange,
  startDate,
  onStartDateSelect,
  endDate,
  onEndDateSelect,
}: ProposalsFiltersProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <Select value={selectedAgency} onValueChange={onAgencyChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Agency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Agencies</SelectItem>
          <SelectItem value="DOD">Department of Defense</SelectItem>
          <SelectItem value="NASA">NASA</SelectItem>
          <SelectItem value="ED">Department of Education</SelectItem>
          <SelectItem value="DOE">Department of Energy</SelectItem>
          <SelectItem value="HHS">Health and Human Services</SelectItem>
        </SelectContent>
      </Select>

      <DatePicker
        selected={startDate}
        onSelect={onStartDateSelect}
        placeholderText="Start Date"
      />

      <DatePicker
        selected={endDate}
        onSelect={onEndDateSelect}
        placeholderText="End Date"
      />
    </div>
  )
}