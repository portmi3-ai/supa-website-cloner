import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProposalsSearch } from "@/components/proposals/ProposalsSearch"
import { ProposalsTable } from "@/components/proposals/ProposalsTable"
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
  const [selectedAgency, setSelectedAgency] = useState<string>("all")
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
        console.log('Grants API Response:', grantsResponse)
        console.log('Federal Data Response:', federalResponse)
        console.log('SAM API Response:', samResponse)

        if (grantsResponse.error) {
          console.error('Grants API Error:', grantsResponse.error)
          toast({
            title: "Error fetching grants data",
            description: "There was an error fetching grants data. Please try again.",
            variant: "destructive",
          })
        }

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
              <SelectItem value="all">All Agencies</SelectItem>
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