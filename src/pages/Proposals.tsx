import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProposalsTable } from "@/components/proposals/ProposalsTable"
import { ProposalsHeader } from "@/components/proposals/ProposalsHeader"
import { ProposalsFilters } from "@/components/proposals/ProposalsFilters"
import { useProposalsData } from "@/hooks/useProposalsData"

const Proposals = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAgency, setSelectedAgency] = useState<string>("all")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const { allProposals, isLoading } = useProposalsData({
    searchQuery,
    selectedAgency,
    startDate,
    endDate,
  })

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <ProposalsHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <ProposalsFilters
          selectedAgency={selectedAgency}
          onAgencyChange={setSelectedAgency}
          startDate={startDate}
          onStartDateSelect={setStartDate}
          endDate={endDate}
          onEndDateSelect={setEndDate}
        />

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <ProposalsTable proposals={allProposals} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Proposals