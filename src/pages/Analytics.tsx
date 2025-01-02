import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const Analytics = () => {
  const { user } = useAuth()

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics")
        .select("*")
        .eq("user_id", user?.id)

      if (error) {
        toast.error("Error fetching analytics data")
        throw error
      }

      return data
    },
    enabled: !!user?.id,
  })

  const chartData = {
    labels: analyticsData?.map((d) => d.date) || [],
    datasets: [
      {
        label: "Proposals Submitted",
        data: analyticsData?.map((d) => d.proposals_submitted) || [],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Proposals Awarded",
        data: analyticsData?.map((d) => d.proposals_awarded) || [],
        borderColor: "rgb(153, 102, 255)",
        tension: 0.1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Proposal Analytics",
      },
    },
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
        <div className="grid gap-6">
          <Card className="p-6">
            <Line data={chartData} options={options} />
          </Card>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm text-muted-foreground">Total Proposals</h3>
                <p className="text-2xl font-bold">
                  {analyticsData?.reduce(
                    (sum, item) => sum + item.proposals_submitted,
                    0
                  ) || 0}
                </p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground">Success Rate</h3>
                <p className="text-2xl font-bold">
                  {analyticsData
                    ? `${Math.round(
                        (analyticsData.reduce(
                          (sum, item) => sum + item.proposals_awarded,
                          0
                        ) /
                          analyticsData.reduce(
                            (sum, item) => sum + item.proposals_submitted,
                            0
                          )) *
                          100
                      )}%`
                    : "0%"}
                </p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground">Total Awarded</h3>
                <p className="text-2xl font-bold">
                  {analyticsData?.reduce(
                    (sum, item) => sum + item.proposals_awarded,
                    0
                  ) || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Analytics