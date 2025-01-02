import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TeamMember } from "@/types/team.types"

const Team = () => {
  const [isInviting, setIsInviting] = useState(false)

  const { data: teamMembers } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("username")

      if (error) throw error

      // Transform profiles to match TeamMember interface
      return profiles.map((profile): TeamMember => ({
        id: profile.id,
        username: profile.username,
        email: "", // This would need to come from auth.users but we can't query it directly
        role: "Member", // Default role
        avatar_url: profile.avatar_url,
        updated_at: profile.updated_at
      }))
    }
  })

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Team Management</h1>
          <Button onClick={() => setIsInviting(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Team Member
          </Button>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers?.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {member.username?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-medium">{member.username || "Unnamed User"}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Team