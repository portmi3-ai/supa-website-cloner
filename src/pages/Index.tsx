import { useAuth } from "@/App"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TopBar } from "@/components/dashboard/TopBar"
import { DashboardCards } from "@/components/dashboard/DashboardCards"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"

const Index = () => {
  const { user } = useAuth()

  // Fetch user profile data
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single()

      if (error) throw error
      return data
    },
  })

  return (
    <DashboardLayout>
      <TopBar username={profile?.username} email={user?.email} />
      <DashboardCards username={profile?.username} />
    </DashboardLayout>
  )
}

export default Index