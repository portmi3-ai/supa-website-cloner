import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AgencySelectProps {
  value: string
  onChange: (value: string) => void
}

export function AgencySelect({ value, onChange }: AgencySelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
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
  )
}