import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { ProfileCompletionCard } from "./cards/ProfileCompletionCard"
import { SettingsOverviewCard } from "./cards/SettingsOverviewCard"
import { RecentActivityCard } from "./cards/RecentActivityCard"

interface DashboardCardsProps {
  username?: string
}

export function DashboardCards({ username }: DashboardCardsProps) {
  const { user } = useAuth()
  const [recentActivity, setRecentActivity] = useState<string[]>([])

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

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completed = 0
    let total = 3 // Total number of profile items to complete

    if (username) completed++
    if (settings?.email_notifications !== undefined) completed++
    if (settings?.theme) completed++

    return Math.round((completed / total) * 100)
  }

  const profileCompletion = calculateProfileCompletion()

  // Get profile completion suggestions
  const getCompletionSuggestions = () => {
    const suggestions = []
    if (!username) suggestions.push("Add a username")
    if (!settings?.email_notifications) suggestions.push("Enable notifications")
    if (!settings?.theme) suggestions.push("Set your preferred theme")
    return suggestions
  }

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("dashboard-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user?.id}`,
        },
        (payload) => {
          toast.success("Profile updated")
          setRecentActivity((prev) => [
            `Profile updated at ${new Date().toLocaleTimeString()}`,
            ...prev.slice(0, 4),
          ])
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "settings",
          filter: `id=eq.${user?.id}`,
        },
        (payload) => {
          toast.success("Settings updated")
          setRecentActivity((prev) => [
            `Settings updated at ${new Date().toLocaleTimeString()}`,
            ...prev.slice(0, 4),
          ])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Welcome Back{username ? `, ${username}` : ""}!
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProfileCompletionCard
          username={username}
          profileCompletion={profileCompletion}
          completionSuggestions={getCompletionSuggestions()}
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