import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProposalsSearch } from "@/components/proposals/ProposalsSearch"
import { FileText } from "lucide-react"

const Proposals = () => {
  const [searchQuery, setSearchQuery] = useState("")

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
          {searchQuery ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No proposals found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We couldn't find any proposals matching "{searchQuery}".
                  <br />
                  Try adjusting your search terms or check back later for new opportunities.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Available Proposals & Grants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Search for available proposals and grants using the search bar above.
                  You can search by title, description, or funding agency.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Proposals