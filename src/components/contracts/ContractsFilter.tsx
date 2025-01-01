import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ContractStatus } from "@/types/contracts.types"

interface ContractsFilterProps {
  selectedStatus: ContractStatus | "all"
  onStatusChange: (status: ContractStatus | "all") => void
}

const CONTRACT_STATUSES: (ContractStatus | "all")[] = [
  "all",
  "draft",
  "pending",
  "active",
  "completed",
  "cancelled",
]

export function ContractsFilter({
  selectedStatus,
  onStatusChange,
}: ContractsFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CONTRACT_STATUSES.map((status) => (
        <Button
          key={status}
          variant={selectedStatus === status ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange(status)}
          className="capitalize"
        >
          {status}
          <Badge variant="secondary" className="ml-2">
            {status === "all" ? "All" : status.charAt(0).toUpperCase()}
          </Badge>
        </Button>
      ))}
    </div>
  )
}