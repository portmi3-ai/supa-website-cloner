import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TopBar } from "@/components/dashboard/TopBar"
import { DashboardCards } from "@/components/dashboard/DashboardCards"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { toast } from "sonner"

const Index = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

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

      // If no profile exists, create one
      if (!data) {
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([{ id: user?.id }])
          .select()
          .maybeSingle()

        if (createError) {
          toast.error("Error creating profile")
          throw createError
        }

        return newProfile
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
      <DashboardCards username={profile?.username} />
    </DashboardLayout>
  )
}

export default Index
