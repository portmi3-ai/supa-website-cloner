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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { useSaveSearch } from "@/hooks/useFederalContractsSearch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface FederalContractsFiltersProps {
  selectedAgency: string
  onAgencyChange: (value: string) => void
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
  searchTerm: string
  noticeType: string
  onNoticeTypeChange: (value: string) => void
  activeOnly: boolean
  onActiveOnlyChange: (value: boolean) => void
}

export function FederalContractsFilters({
  selectedAgency,
  onAgencyChange,
  dateRange,
  onDateRangeChange,
  searchTerm,
  noticeType,
  onNoticeTypeChange,
  activeOnly,
  onActiveOnlyChange,
}: FederalContractsFiltersProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchName, setSearchName] = useState("")
  const { saveSearch } = useSaveSearch()

  const handleSaveSearch = async () => {
    await saveSearch(searchName, {
      searchTerm,
      agency: selectedAgency,
      dateRange,
      noticeType,
      activeOnly,
    })
    setIsDialogOpen(false)
    setSearchName("")
  }

  return (
    <div className="space-y-4">
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

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Advanced Filters</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Advanced Filters</SheetTitle>
              <SheetDescription>
                Refine your search with additional filters
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label>Notice Type</Label>
                <RadioGroup value={noticeType} onValueChange={onNoticeTypeChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="presolicitation" id="presolicitation" />
                    <Label htmlFor="presolicitation">Presolicitation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="combined" id="combined" />
                    <Label htmlFor="combined">Combined Synopsis/Solicitation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sources" id="sources" />
                    <Label htmlFor="sources">Sources Sought</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={activeOnly}
                  onCheckedChange={(checked) => onActiveOnlyChange(checked as boolean)}
                />
                <Label htmlFor="active">Active opportunities only</Label>
              </div>
            </div>
          </SheetContent>
        </Sheet>

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
      </div>
    </div>
  )
}