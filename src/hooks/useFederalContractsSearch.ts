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
        const { data, error } = await supabase.functions.invoke("searchFederalData", {
          body: {
            searchTerm: params.searchTerm,
            agency: params.agency,
            startDate: params.startDate?.toISOString(),
            endDate: params.endDate?.toISOString(),
            page: params.page || 1,
            noticeType: params.noticeType,
            activeOnly: params.activeOnly,
            sortField: params.sortField,
            sortDirection: params.sortDirection
          }
        })

        if (error) throw error
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
    enabled: true, // Always enabled to show initial results
  })
}