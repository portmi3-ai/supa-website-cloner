import { Badge } from "@/components/ui/badge"
import { ProposalStatus } from "@/types/proposals.types"

interface ProposalStatusBadgeProps {
  status: ProposalStatus | null
}

export function ProposalStatusBadge({ status }: ProposalStatusBadgeProps) {
  if (!status) return null

  const variants: Record<ProposalStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    draft: {
      label: "Draft",
      variant: "secondary",
    },
    submitted: {
      label: "Submitted",
      variant: "default",
    },
    under_review: {
      label: "Under Review",
      variant: "outline",
    },
    awarded: {
      label: "Awarded",
      variant: "default",
    },
    rejected: {
      label: "Rejected",
      variant: "destructive",
    },
  }

  // Add safety check for invalid status values
  if (!(status in variants)) {
    console.warn(`Invalid proposal status: ${status}`)
    return <Badge variant="outline">Unknown</Badge>
  }

  const { label, variant } = variants[status]

  return <Badge variant={variant}>{label}</Badge>
}