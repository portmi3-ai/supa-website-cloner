import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/useAuth"

interface SearchParams {
  searchTerm: string
  agency?: string
  startDate?: Date
  endDate?: Date
  page?: number
  noticeType?: string
  activeOnly?: boolean
  sortField?: string
  sortDirection?: 'asc' | 'desc'
}

export function useFederalContractsSearch(params: SearchParams) {
  const { toast } = useToast()
  const { user } = useAuth()

  return useQuery({
    queryKey: ["federal-contracts", params],
    queryFn: async () => {
      try {
        console.log('Testing RLS - Current user:', user?.id)
        console.log('Fetching federal contracts with params:', params)
        
        // Test RLS by attempting to fetch data
        const { data: testData, error: testError } = await supabase
          .from('federal_data')
          .select('*')
          .limit(1)

        console.log('RLS Test - Result:', testData ? 'Success' : 'No data', 'Error:', testError)
        
        const { data, error } = await supabase.functions.invoke("searchFederalData", {
          body: {
            searchTerm: params.searchTerm || '*',
            agency: params.agency,
            startDate: params.startDate?.toISOString(),
            endDate: params.endDate?.toISOString(),
            page: params.page || 0,
            noticeType: params.noticeType,
            activeOnly: params.activeOnly,
            sortField: params.sortField,
            sortDirection: params.sortDirection,
            limit: 50
          }
        })

        if (error) {
          console.error('Error from Edge Function:', error)
          throw error
        }
        
        if (!data || !data.data) {
          console.error('Invalid response format:', data)
          throw new Error('Invalid response format from server')
        }
        
        console.log('Search results:', {
          totalRecords: data.totalRecords,
          currentPage: data.currentPage,
          resultsCount: data.data.length
        })
        
        return data
      } catch (error) {
        console.error("Error fetching federal contracts:", error)
        toast({
          title: "Error",
          description: "Failed to fetch federal contracts. Please try again.",
          variant: "destructive",
        })
        throw error
      }
    },
    enabled: !!user, // Only run query when user is authenticated
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
    retry: 2,
  })
}