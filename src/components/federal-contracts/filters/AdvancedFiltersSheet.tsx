import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface AdvancedFiltersSheetProps {
  noticeType: string
  onNoticeTypeChange: (value: string) => void
  activeOnly: boolean
  onActiveOnlyChange: (value: boolean) => void
}

export function AdvancedFiltersSheet({
  noticeType,
  onNoticeTypeChange,
  activeOnly,
  onActiveOnlyChange,
}: AdvancedFiltersSheetProps) {
  return (
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
  )
}