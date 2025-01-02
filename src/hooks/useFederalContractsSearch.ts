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
            page: params.page || 1
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
    enabled: !!params.searchTerm,
  })
}

export function useSaveSearch() {
  const { toast } = useToast()
  const { user } = useAuth()

  const saveSearch = async (name: string, searchCriteria: any) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save searches",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase
        .from("saved_searches")
        .insert({
          name,
          search_criteria: searchCriteria,
          user_id: user.id,
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Search criteria saved successfully",
      })
    } catch (error) {
      console.error("Error saving search:", error)
      toast({
        title: "Error",
        description: "Failed to save search. Please try again.",
        variant: "destructive",
      })
    }
  }

  return { saveSearch }
}