import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export function FederalContractsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">
          Federal Contracts Search
        </h2>
        <p className="text-muted-foreground">
          Search and filter federal contract opportunities
        </p>
      </div>
      <Button variant="outline" size="sm">
        <Bell className="mr-2 h-4 w-4" />
        Notify Me Daily
      </Button>
    </div>
  )
}