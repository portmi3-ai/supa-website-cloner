import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/useDebounce"

interface FederalContractsSearchBarProps {
  value: string
  onChange: (value: string) => void
  isLoading?: boolean
}

export function FederalContractsSearchBar({
  value,
  onChange,
  isLoading = false
}: FederalContractsSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(value)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    onChange(debouncedSearchTerm)
  }, [debouncedSearchTerm, onChange])

  return (
    <div className="search-input glow-effect floating relative">
      {isLoading ? (
        <Loader2 className="absolute left-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground animate-pulse-glow" />
      )}
      <Input
        placeholder="Search contracts by keyword, number, or agency..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8 bg-background/50 backdrop-blur-sm border-0 transition-all duration-300 focus:ring-2 focus:ring-primary/50"
      />
    </div>
  )
}