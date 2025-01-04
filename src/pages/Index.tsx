import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { DashboardCards } from "@/components/dashboard/DashboardCards"
import { LoadingSpinner } from "@/components/ui/loading"
import { toast } from "sonner"

const Index = () => {
  const { user } = useAuth()

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
    return <LoadingSpinner />
  }

  return (
    <div className="w-full transition-all duration-300 ease-in-out">
      <DashboardCards username={profile?.username} />
    </div>
  )
}

export default Index