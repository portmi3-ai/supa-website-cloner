import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Proposals = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Proposal Management</h1>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create and track your proposals here. Coming soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Proposals