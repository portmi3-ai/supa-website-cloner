export interface FPDSSearchParams {
  searchTerm?: string
  agency?: string
  page?: number
  limit?: number
}

export interface CachedData {
  timestamp: number
  data: FPDSContractData[]
}

export interface FPDSContractData {
  id: string
  title: string
  description: string
  funding_agency: string | null
  funding_amount: number | null
  status: string
  source: string
  contract_type: string
}