import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "lucide-react"

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                Contract Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View contract performance metrics and trends. Coming soon.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Proposal Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track proposal success rates and win/loss analysis. Coming soon.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Revenue Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analyze revenue distribution across contracts. Coming soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Analytics