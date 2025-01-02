import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TopBar } from "@/components/dashboard/TopBar"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { toast } from "sonner"
import { ProfileCompletionCard } from "./cards/ProfileCompletionCard"
import { SettingsOverviewCard } from "./cards/SettingsOverviewCard"
import { RecentActivityCard } from "./cards/RecentActivityCard"
import { useRecentActivity } from "@/hooks/useRecentActivity"
import { useProfileCompletion } from "@/hooks/useProfileCompletion"
import { BarChart, Rocket, Sparkles } from "lucide-react"

interface DashboardCardsProps {
  username?: string
}

export function DashboardCards({ username }: DashboardCardsProps) {
  const { user } = useAuth()
  const recentActivity = useRecentActivity(user?.id)

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
    <DashboardLayout>
      <TopBar username={username} email={user?.email} />
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <Rocket className="h-8 w-8 text-primary animate-pulse" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            Welcome to 3030{username ? `, ${username}` : ""}!
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="dashboard-card futuristic-border glow-effect">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Profile Status
              </h2>
            </div>
            <ProfileCompletionCard
              username={username}
              profileCompletion={profileCompletion}
              completionSuggestions={completionSuggestions}
            />
          </div>

          <div className="dashboard-card futuristic-border glow-effect">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                System Settings
              </h2>
            </div>
            <SettingsOverviewCard
              settings={settings}
              isLoading={isLoadingSettings}
            />
          </div>

          <div className="dashboard-card futuristic-border glow-effect">
            <RecentActivityCard activities={recentActivity} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}