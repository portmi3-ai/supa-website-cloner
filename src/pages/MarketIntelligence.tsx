import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Loader2 } from "lucide-react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function MarketIntelligence() {
  const { data: marketData, isLoading } = useQuery({
    queryKey: ["market-intelligence"],
    queryFn: async () => {
      const { data: contracts, error } = await supabase
        .from("contracts")
        .select("*")
      
      if (error) throw error

      // Process data for visualizations
      const agencySpending = contracts.reduce((acc: any, contract) => {
        const agency = contract.agency || "Unknown"
        acc[agency] = (acc[agency] || 0) + (contract.value || 0)
        return acc
      }, {})

      const spendingTrends = Object.entries(agencySpending).map(([agency, value]) => ({
        agency,
        value,
      }))

      return {
        spendingTrends,
        totalContracts: contracts.length,
        totalValue: contracts.reduce((sum, contract) => sum + (contract.value || 0), 0),
      }
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">Market Intelligence</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Agency Spending Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={marketData?.spendingTrends}
                dataKey="value"
                nameKey="agency"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {marketData?.spendingTrends.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Agency Spending Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={marketData?.spendingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="agency" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Total Contracts</h3>
          <p className="text-3xl font-bold">{marketData?.totalContracts}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold">Total Contract Value</h3>
          <p className="text-3xl font-bold">
            ${marketData?.totalValue.toLocaleString()}
          </p>
        </Card>
      </div>
    </div>
  )
}