import { useAuth } from "@/App"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TopBar } from "@/components/dashboard/TopBar"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState("")

  const { data: profile, refetch } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single()

      if (error) throw error
      if (data) {
        setUsername(data.username || "")
      }
      return data
    },
  })

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username })
        .eq("id", user?.id)

      if (error) throw error

      toast.success("Profile updated successfully")
      setIsEditing(false)
      refetch()
    } catch (error) {
      toast.error("Error updating profile")
      console.error("Error updating profile:", error)
    }
  }

  return (
    <DashboardLayout>
      <TopBar username={profile?.username} email={user?.email} />
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input value={user?.email || ""} disabled />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Username
                  </label>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                      />
                      <Button onClick={handleUpdateProfile}>Save</Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <Input value={profile?.username || ""} disabled />
                      <Button onClick={() => setIsEditing(true)}>Edit</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Profile