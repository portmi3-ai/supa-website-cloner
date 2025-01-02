import { CachedData, FPDSContractData } from './types'

const CACHE_DURATION = 3600000 // 1 hour in milliseconds

export function getCachedResults(): FPDSContractData[] | null {
  try {
    const cachedDataStr = localStorage.getItem('fpds_cache')
    if (cachedDataStr) {
      const cachedData: CachedData = JSON.parse(cachedDataStr)
      const cacheAge = Date.now() - cachedData.timestamp
      
      if (cacheAge < CACHE_DURATION) {
        console.log('Using cached FPDS results')
        return cachedData.data
      }
    }
  } catch (cacheError) {
    console.warn('Failed to retrieve cached FPDS results:', cacheError)
  }
  return null
}

export function setCachedResults(data: FPDSContractData[]): void {
  try {
    const cacheData: CachedData = {
      timestamp: Date.now(),
      data
    }
    localStorage.setItem('fpds_cache', JSON.stringify(cacheData))
  } catch (cacheError) {
    console.warn('Failed to cache FPDS results:', cacheError)
  }
}