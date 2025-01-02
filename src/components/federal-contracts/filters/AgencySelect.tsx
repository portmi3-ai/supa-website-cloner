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
        <SelectItem value="all">All Sources</SelectItem>
        
        {/* Federal Departments */}
        <SelectItem value="DOD">Department of Defense</SelectItem>
        <SelectItem value="NASA">NASA</SelectItem>
        <SelectItem value="DOE">Department of Energy</SelectItem>
        <SelectItem value="HHS">Health and Human Services</SelectItem>
        <SelectItem value="DHS">Department of Homeland Security</SelectItem>
        <SelectItem value="DOT">Department of Transportation</SelectItem>
        <SelectItem value="VA">Department of Veterans Affairs</SelectItem>
        <SelectItem value="DOI">Department of Interior</SelectItem>
        <SelectItem value="EPA">Environmental Protection Agency</SelectItem>
        <SelectItem value="USDA">Department of Agriculture</SelectItem>
        <SelectItem value="DOC">Department of Commerce</SelectItem>
        <SelectItem value="ED">Department of Education</SelectItem>
        <SelectItem value="DOL">Department of Labor</SelectItem>
        <SelectItem value="STATE">Department of State</SelectItem>
        <SelectItem value="TREAS">Department of Treasury</SelectItem>
        
        {/* Additional Procurement Sources */}
        <SelectItem value="GSA">GSA Schedules</SelectItem>
        <SelectItem value="SBA">Small Business Administration</SelectItem>
        <SelectItem value="PTAC">PTACs</SelectItem>
        <SelectItem value="LOCAL">Local Government</SelectItem>
        <SelectItem value="STATE_PROC">State Procurement</SelectItem>
      </SelectContent>
    </Select>
  )
}