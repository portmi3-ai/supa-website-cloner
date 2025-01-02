import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

const Vendors = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Vendor Management</h1>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Vendor Directory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage your vendors and track their performance. Coming soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Vendors