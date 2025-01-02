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
      <SelectTrigger className="w-full md:w-[200px] glass-card">
        <SelectValue placeholder="Select agency" />
      </SelectTrigger>
      <SelectContent className="glass-card">
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
        
        {/* State Procurement */}
        <SelectItem value="MI">Michigan Contract Connect</SelectItem>
        <SelectItem value="NY">New York State Procurement</SelectItem>
        <SelectItem value="CA">California eProcurement</SelectItem>
        <SelectItem value="TX">Texas SmartBuy</SelectItem>
        <SelectItem value="FL">Florida Vendor Bid System</SelectItem>
        
        {/* Local Government */}
        <SelectItem value="LA_CITY">Los Angeles BAVN</SelectItem>
        <SelectItem value="NYC">NYC PASSPort</SelectItem>
        <SelectItem value="CHI">Chicago eProcurement</SelectItem>
        <SelectItem value="HOU">Houston Supplier Portal</SelectItem>
        <SelectItem value="PHX">Phoenix Vendor Portal</SelectItem>
      </SelectContent>
    </Select>
  )
}