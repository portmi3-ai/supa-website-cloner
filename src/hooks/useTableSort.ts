import { useState } from "react"

export type SortField = "contract_number" | "title" | "status" | "value" | "start_date" | "end_date"
export type SortDirection = "asc" | "desc"

export function useTableSort(defaultField: SortField = "contract_number") {
  const [sortField, setSortField] = useState<SortField>(defaultField)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortData = <T extends Record<string, any>>(data: T[]) => {
    return [...data].sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * direction
      }

      return ((aValue || "") > (bValue || "") ? 1 : -1) * direction
    })
  }

  return {
    sortField,
    sortDirection,
    handleSort,
    sortData,
  }
}