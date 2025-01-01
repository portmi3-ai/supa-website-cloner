import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface ContractsSearchProps {
  value: string
  onChange: (value: string) => void
}

export function ContractsSearch({ value, onChange }: ContractsSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search contracts..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
    </div>
  )
}