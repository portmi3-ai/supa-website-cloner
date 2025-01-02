import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface FederalContractsSearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function FederalContractsSearchBar({
  value,
  onChange,
}: FederalContractsSearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search contracts by keyword or number..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
    </div>
  )
}