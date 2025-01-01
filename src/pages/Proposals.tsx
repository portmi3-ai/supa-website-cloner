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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"

const Proposals = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAgency, setSelectedAgency] = useState<string>("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const { toast } = useToast()

  // Fetch data from multiple sources
  const { data: federalData = [], isLoading: isFederalLoading } = useQuery({
    queryKey: ["federalData", searchQuery, selectedAgency, startDate, endDate],
    queryFn: async () => {
      try {
        const [grantsResponse, federalResponse, samResponse] = await Promise.all([
          supabase.functions.invoke("searchGrants", {
            body: { searchTerm: searchQuery },
          }),
          supabase.functions.invoke("searchFederalData", {
            body: {
              searchTerm: searchQuery,
              agency: selectedAgency,
              startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
              endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
            },
          }),
          supabase.functions.invoke("samApi", {
            body: {
              searchTerm: searchQuery,
              agency: selectedAgency,
            },
          }),
        ])

        if (grantsResponse.error) throw grantsResponse.error
        if (federalResponse.error) throw federalResponse.error
        if (samResponse.error) throw samResponse.error

        // Combine results from all sources
        const combinedResults = [
          ...(grantsResponse.data || []),
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
        throw error
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

  // Combine all results
  const allProposals = [...(federalData || []), ...(localProposals || [])]
  const isLoading = isFederalLoading || isLocalLoading

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">Federal Grants & Contracts</h1>
          <div className="w-full md:w-96">
            <ProposalsSearch value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Select value={selectedAgency} onValueChange={setSelectedAgency}>
            <SelectTrigger>
              <SelectValue placeholder="Select Agency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Agencies</SelectItem>
              <SelectItem value="DOD">Department of Defense</SelectItem>
              <SelectItem value="NASA">NASA</SelectItem>
              <SelectItem value="ED">Department of Education</SelectItem>
              <SelectItem value="DOE">Department of Energy</SelectItem>
              <SelectItem value="HHS">Health and Human Services</SelectItem>
            </SelectContent>
          </Select>

          <DatePicker
            selected={startDate}
            onSelect={setStartDate}
            placeholderText="Start Date"
          />

          <DatePicker
            selected={endDate}
            onSelect={setEndDate}
            placeholderText="End Date"
          />
        </div>

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