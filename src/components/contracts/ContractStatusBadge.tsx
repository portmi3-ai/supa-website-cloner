import { Badge } from "@/components/ui/badge"
import { ContractStatus } from "@/types/contracts.types"

interface ContractStatusBadgeProps {
  status: ContractStatus
}

export function ContractStatusBadge({ status }: ContractStatusBadgeProps) {
  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case "draft":
        return "bg-gray-500"
      case "pending":
        return "bg-yellow-500"
      case "active":
        return "bg-green-500"
      case "completed":
        return "bg-blue-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Badge className={`${getStatusColor(status)} text-white`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}