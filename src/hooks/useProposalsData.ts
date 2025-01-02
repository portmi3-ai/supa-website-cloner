import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Proposal } from "@/types/proposals.types"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

interface UseProposalsDataProps {
  searchQuery: string
  selectedAgency: string
  startDate?: Date
  endDate?: Date
}

export function useProposalsData({
  searchQuery,
  selectedAgency,
  startDate,
  endDate,
}: UseProposalsDataProps) {
  const { toast } = useToast()

  // Fetch data from federal sources
  const { data: federalData = [], isLoading: isFederalLoading } = useQuery({
    queryKey: ["federalData", searchQuery, selectedAgency, startDate, endDate],
    queryFn: async () => {
      try {
        const [federalResponse, samResponse] = await Promise.all([
          supabase.functions.invoke("searchFederalData", {
            body: {
              searchTerm: searchQuery,
              agency: selectedAgency === "all" ? undefined : selectedAgency,
              startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
              endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
            },
          }),
          supabase.functions.invoke("samApi", {
            body: {
              searchTerm: searchQuery,
              agency: selectedAgency === "all" ? undefined : selectedAgency,
            },
          }),
        ])

        // Log responses for debugging
        console.log('Federal Data Response:', federalResponse)
        console.log('SAM API Response:', samResponse)

        if (federalResponse.error) {
          console.error('Federal Data Error:', federalResponse.error)
          toast({
            title: "Error fetching federal data",
            description: "There was an error fetching federal data. Please try again.",
            variant: "destructive",
          })
        }

        if (samResponse.error) {
          console.error('SAM API Error:', samResponse.error)
          toast({
            title: "Error fetching SAM data",
            description: "There was an error fetching SAM data. Please try again.",
            variant: "destructive",
          })
        }

        // Combine results from all sources, filtering out failed responses
        const combinedResults = [
          ...(federalResponse.data || []),
          ...(samResponse.data || []),
        ]

        console.log('Combined federal data results:', combinedResults)
        return combinedResults as Proposal[]
      } catch (error) {
        console.error('Error fetching opportunities:', error)
        toast({
          title: "Error fetching opportunities",
          description: "There was an error fetching the opportunities. Please try again.",
          variant: "destructive",
        })
        return []
      }
    },
  })

  // Fetch local proposals
  const { data: localProposals = [], isLoading: isLocalLoading } = useQuery({
    queryKey: ["proposals", searchQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,funding_agency.ilike.%${searchQuery}%`)

      if (error) throw error
      return data as Proposal[]
    },
  })

  return {
    allProposals: [...(federalData || []), ...(localProposals || [])],
    isLoading: isFederalLoading || isLocalLoading,
  }
}