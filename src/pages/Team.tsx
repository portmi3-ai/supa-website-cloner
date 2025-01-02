import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, UserPlus } from "lucide-react"

interface TeamMember {
  id: string
  email: string
  role: string
  avatar_url?: string
}

export default function Team() {
  const [inviteEmail, setInviteEmail] = useState("")
  const { toast } = useToast()
  const [isInviting, setIsInviting] = useState(false)

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
      
      if (error) throw error
      return data as TeamMember[]
    }
  })

  const handleInvite = async () => {
    try {
      setIsInviting(true)
      const { error } = await supabase.functions.invoke("invite-team-member", {
        body: { email: inviteEmail }
      })

      if (error) throw error

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${inviteEmail}`
      })
      setInviteEmail("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsInviting(false)
    }
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Email address"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <Button onClick={handleInvite} disabled={!inviteEmail || isInviting}>
            {isInviting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Invite Member
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : teamMembers?.map((member) => (
          <Card key={member.id} className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={member.avatar_url} />
                <AvatarFallback>
                  {member.email.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{member.email}</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {member.role}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}