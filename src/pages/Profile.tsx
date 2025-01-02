import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TopBar } from "@/components/dashboard/TopBar"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { toast } from "sonner"

const Profile = () => {
  const { user } = useAuth()

  // Fetch user profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle()

      if (error) {
        toast.error("Error fetching profile")
        throw error
      }

      return data
    },
    enabled: !!user?.id,
  })

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
      <TopBar username={profile?.username} email={user?.email} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <div className="mt-4">
          <p><strong>Username:</strong> {profile?.username || "N/A"}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Profile
