import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Contract } from "@/types/contracts.types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MarketIntelligence = () => {
  const { data: contracts } = useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
      
      if (error) throw error
      return data as Contract[]
    }
  })

  const contractValueByMonth = contracts?.reduce((acc: any[], contract) => {
    if (!contract.start_date) return acc
    const month = new Date(contract.start_date).toLocaleString('default', { month: 'long' })
    const existingMonth = acc.find(item => item.month === month)
    
    if (existingMonth) {
      existingMonth.value += contract.value || 0
    } else {
      acc.push({ month, value: contract.value || 0 })
    }
    return acc
  }, []) || []

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Market Intelligence</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Value by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contractValueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MarketIntelligence