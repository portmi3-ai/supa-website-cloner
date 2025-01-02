import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

const Team = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Team Management</h1>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Team Member
          </Button>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage your team members and their permissions here. Coming soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Team