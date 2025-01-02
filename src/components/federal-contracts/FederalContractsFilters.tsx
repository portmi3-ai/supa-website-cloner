import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useSaveSearch } from "@/hooks/useFederalContractsSearch"

interface FederalContractsFiltersProps {
  selectedAgency: string
  onAgencyChange: (value: string) => void
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
  searchTerm: string
}

export function FederalContractsFilters({
  selectedAgency,
  onAgencyChange,
  dateRange,
  onDateRangeChange,
  searchTerm,
}: FederalContractsFiltersProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchName, setSearchName] = useState("")
  const { saveSearch } = useSaveSearch()

  const handleSaveSearch = async () => {
    await saveSearch(searchName, {
      searchTerm,
      agency: selectedAgency,
      dateRange,
    })
    setIsDialogOpen(false)
    setSearchName("")
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <Select value={selectedAgency} onValueChange={onAgencyChange}>
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

      <DatePickerWithRange date={dateRange} onDateChange={onDateRangeChange} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Save Search</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Search Criteria</DialogTitle>
            <DialogDescription>
              Save your current search criteria for quick access later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="search-name">Search Name</Label>
              <Input
                id="search-name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Enter a name for this search"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSearch}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button variant="outline" className="ml-auto">
        Advanced Filters
      </Button>
    </div>
  )
}