import { useState } from 'react'
import { SortConfig } from '../table/types'

export function useSortableTable(defaultField: string = 'posted_date') {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: defaultField,
    direction: 'desc'
  })

  const handleSort = (field: string) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  return {
    sortField: sortConfig.field,
    sortDirection: sortConfig.direction,
    onSort: handleSort
  }
}