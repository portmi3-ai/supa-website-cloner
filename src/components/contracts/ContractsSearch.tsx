import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce"
import { useState, useEffect } from "react"

interface ContractsSearchProps {
  value: string
  onChange: (value: string) => void
  isLoading?: boolean
}

export function ContractsSearch({ 
  value, 
  onChange,
  isLoading = false 
}: ContractsSearchProps) {
  const [searchTerm, setSearchTerm] = useState(value)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    onChange(debouncedSearchTerm)
  }, [debouncedSearchTerm, onChange])

  return (
    <div className="relative">
      {isLoading ? (
        <Loader2 className="absolute left-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      )}
      <Input
        placeholder="Search contracts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
      />
    </div>
  )
}