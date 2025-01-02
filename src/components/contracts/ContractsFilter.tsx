import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ContractStatus } from "@/types/contracts.types"
import { motion } from "framer-motion"

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
        <motion.div
          key={status}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant={selectedStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusChange(status)}
            className="capitalize transition-all duration-200"
          >
            {status}
            <Badge 
              variant="secondary" 
              className="ml-2 transition-colors"
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase()}
            </Badge>
          </Button>
        </motion.div>
      ))}
    </div>
  )
}