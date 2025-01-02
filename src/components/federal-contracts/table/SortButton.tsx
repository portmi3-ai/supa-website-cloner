import { Button } from "@/components/ui/button"
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"

interface SortButtonProps {
  field: string
  currentSortField: string
  sortDirection: 'asc' | 'desc'
  onSort: (field: string) => void
  children: React.ReactNode
}

export function SortButton({
  field,
  currentSortField,
  sortDirection,
  onSort,
  children
}: SortButtonProps) {
  const getSortIcon = () => {
    if (field !== currentSortField) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    )
  }

  return (
    <Button
      variant="ghost"
      onClick={() => onSort(field)}
      className="hover:bg-transparent"
    >
      {children}
      {getSortIcon()}
    </Button>
  )
}