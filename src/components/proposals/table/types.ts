export type SortField = "title" | "funding_agency" | "funding_amount" | "submission_deadline" | "status"
export type SortDirection = "asc" | "desc"

export interface SortState {
  field: SortField
  direction: SortDirection
}