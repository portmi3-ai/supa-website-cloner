export type ProposalStatus = 'draft' | 'submitted' | 'under_review' | 'awarded' | 'rejected'

export interface Proposal {
  id: string
  user_id: string
  title: string
  description: string | null
  funding_agency: string | null
  funding_amount: number | null
  submission_deadline: string | null
  status: ProposalStatus | null
  created_at: string | null
  updated_at: string | null
}