import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Analytics() {
  const { data: contractData } = useQuery({
    queryKey: ["contract-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .order("created_at", { ascending: true })

      if (error) throw error
      return data
    },
  })

  const { data: proposalData } = useQuery({
    queryKey: ["proposal-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .order("created_at", { ascending: true })

      if (error) throw error
      return data
    },
  })

  // Process data for charts
  const contractValueByMonth = contractData?.reduce((acc: any[], contract) => {
    const month = new Date(contract.created_at).toLocaleString('default', { month: 'long' })
    const existingMonth = acc.find(item => item.month === month)
    if (existingMonth) {
      existingMonth.value += contract.value || 0
    } else {
      acc.push({ month, value: contract.value || 0 })
    }
    return acc
  }, []) || []

  const proposalsByStatus = proposalData?.reduce((acc: any[], proposal) => {
    const existingStatus = acc.find(item => item.status === proposal.status)
    if (existingStatus) {
      existingStatus.count += 1
    } else {
      acc.push({ status: proposal.status, count: 1 })
    }
    return acc
  }, []) || []

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Contract Value by Month</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={contractValueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Proposals by Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={proposalsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}