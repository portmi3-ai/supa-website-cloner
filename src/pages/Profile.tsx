import { useAuth } from "@/App"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TopBar } from "@/components/dashboard/TopBar"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { User } from "lucide-react"

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState("")
  const queryClient = useQueryClient()

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

  const updateProfile = useMutation({
    mutationFn: async (updates: { username?: string; avatar_url?: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user?.id)

      if (error) throw error
    },
    onSuccess: () => {
      toast.success("Profile updated successfully")
      setIsEditing(false)
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
    onError: (error) => {
      toast.error("Error updating profile")
      console.error("Error updating profile:", error)
    },
  })

  const handleUpdateProfile = () => {
    updateProfile.mutate({ username })
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split(".").pop()
      const filePath = `${user?.id}/${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath)

      updateProfile.mutate({ avatar_url: publicUrl })
    } catch (error) {
      toast.error("Error uploading avatar")
      console.error("Error uploading avatar:", error)
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
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold mb-2">Profile Picture</h3>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="max-w-xs"
                  />
                </div>
              </div>
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
                      <Button 
                        onClick={handleUpdateProfile}
                        disabled={updateProfile.isPending}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={updateProfile.isPending}
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