import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/useDebounce"

interface FederalContractsSearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function FederalContractsSearchBar({
  value,
  onChange,
}: FederalContractsSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(value)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    onChange(debouncedSearchTerm)
  }, [debouncedSearchTerm, onChange])

  return (
    <div className="search-input glow-effect floating">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground animate-pulse-glow" />
      <Input
        placeholder="Search contracts by keyword or number..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8 bg-background/50 backdrop-blur-sm border-0 transition-all duration-300 focus:ring-2 focus:ring-primary/50"
      />
    </div>
  )
}