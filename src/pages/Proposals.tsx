import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProposalsSearch } from "@/components/proposals/ProposalsSearch"
import { ProposalsTable } from "@/components/proposals/ProposalsTable"
import { FileText } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Proposal } from "@/types/proposals.types"

const Proposals = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const { data: proposals = [], isLoading } = useQuery({
    queryKey: ["proposals", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("proposals")
        .select("*")
        .order("created_at", { ascending: false })

      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,funding_agency.ilike.%${searchQuery}%`
        )
      }

      const { data, error } = await query

      if (error) throw error
      return data as Proposal[]
    },
  })

  const filteredProposals = proposals.filter((proposal) => {
    if (!searchQuery) return true

    const searchTerms = searchQuery.toLowerCase().split(" ")
    const proposalText = `${proposal.title} ${proposal.description || ""} ${
      proposal.funding_agency || ""
    }`.toLowerCase()

    return searchTerms.every((term) => proposalText.includes(term))
  })

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">Proposal & Grant Management</h1>
          <div className="w-full md:w-96">
            <ProposalsSearch value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p>Loading proposals...</p>
              </CardContent>
            </Card>
          ) : filteredProposals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No proposals found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery
                    ? `We couldn't find any proposals matching "${searchQuery}".`
                    : "No proposals have been created yet."}
                  <br />
                  {searchQuery
                    ? "Try adjusting your search terms or check back later for new opportunities."
                    : "Create your first proposal to get started."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Available Proposals & Grants</CardTitle>
              </CardHeader>
              <CardContent>
                <ProposalsTable proposals={filteredProposals} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Proposals