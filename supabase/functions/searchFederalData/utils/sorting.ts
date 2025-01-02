import { FederalDataResult } from '../types.ts'

export const sortResults = (
  results: FederalDataResult[],
  sortField?: string,
  sortDirection?: 'asc' | 'desc'
): FederalDataResult[] => {
  if (!sortField || !sortDirection) return results

  return [...results].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1
    const aValue = a[sortField as keyof FederalDataResult]
    const bValue = b[sortField as keyof FederalDataResult]
    return ((aValue || '') > (bValue || '') ? 1 : -1) * direction
  })
}