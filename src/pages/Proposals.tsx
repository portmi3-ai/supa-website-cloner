import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProposalsSearch } from "@/components/proposals/ProposalsSearch"
import { ProposalsTable } from "@/components/proposals/ProposalsTable"
import { FileText } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Proposal } from "@/types/proposals.types"
import { useToast } from "@/components/ui/use-toast"

const Proposals = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const { data: proposals = [], isLoading, error } = useQuery({
    queryKey: ["proposals", searchQuery],
    queryFn: async () => {
      try {
        // First try to fetch from grants.gov API
        const { data: grantsData, error: grantsError } = await supabase.functions.invoke(
          'searchGrants',
          {
            body: { searchTerm: searchQuery },
          }
        )

        if (grantsError) throw grantsError

        // Merge with local proposals
        const { data: localProposals, error: localError } = await supabase
          .from("proposals")
          .select("*")
          .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,funding_agency.ilike.%${searchQuery}%`)

        if (localError) throw localError

        // Combine and deduplicate results
        const allProposals = [...(grantsData || []), ...(localProposals || [])]
        const uniqueProposals = Array.from(
          new Map(allProposals.map(item => [item.id, item])).values()
        )

        return uniqueProposals as Proposal[]
      } catch (error) {
        toast({
          title: "Error fetching proposals",
          description: "There was an error fetching the proposals. Please try again.",
          variant: "destructive",
        })
        throw error
      }
    },
  })

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">Federal Grants & Proposals</h1>
          <div className="w-full md:w-96">
            <ProposalsSearch value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p>Searching grants and proposals...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Error fetching results</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  There was an error fetching the results. Please try again later.
                </p>
              </CardContent>
            </Card>
          ) : proposals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No results found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery
                    ? `We couldn't find any grants or proposals matching "${searchQuery}".`
                    : "Start typing to search for federal grants and proposals."}
                  <br />
                  Try adjusting your search terms or check back later for new opportunities.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Available Grants & Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <ProposalsTable proposals={proposals} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Proposals