import { Button } from "@/components/ui/button"
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
import { useSaveSearch } from "@/hooks/useSaveSearch"

interface SaveSearchDialogProps {
  searchCriteria: {
    searchTerm: string
    agency: string
    dateRange: {
      from: Date | undefined
      to: Date | undefined
    }
    noticeType: string
    activeOnly: boolean
  }
}

export function SaveSearchDialog({ searchCriteria }: SaveSearchDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchName, setSearchName] = useState("")
  const { saveSearch } = useSaveSearch()

  const handleSaveSearch = async () => {
    await saveSearch(searchName, searchCriteria)
    setIsDialogOpen(false)
    setSearchName("")
  }

  return (
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
  )
}