import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { ProfileCompletionCard } from "./cards/ProfileCompletionCard"
import { SettingsOverviewCard } from "./cards/SettingsOverviewCard"
import { RecentActivityCard } from "./cards/RecentActivityCard"
import { useRecentActivity } from "@/hooks/useRecentActivity"
import { useProfileCompletion } from "@/hooks/useProfileCompletion"

interface DashboardCardsProps {
  username?: string
}

export function DashboardCards({ username }: DashboardCardsProps) {
  const { user } = useAuth()
  const recentActivity = useRecentActivity(user?.id)

  // Fetch user settings
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["settings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle()

      if (error) {
        toast.error("Error fetching settings")
        throw error
      }
      return data
    },
    enabled: !!user?.id,
  })

  const { profileCompletion, completionSuggestions } = useProfileCompletion({
    username,
    settings,
  })

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Welcome Back{username ? `, ${username}` : ""}!
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProfileCompletionCard
          username={username}
          profileCompletion={profileCompletion}
          completionSuggestions={completionSuggestions}
        />
        <SettingsOverviewCard
          settings={settings}
          isLoading={isLoadingSettings}
        />
        <RecentActivityCard activities={recentActivity} />
      </div>
    </div>
  )
}