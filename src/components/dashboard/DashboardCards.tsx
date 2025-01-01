import { useAuth } from "@/App"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useNavigate } from "react-router-dom"
import { User, Settings, Bell, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useEffect, useState } from "react"

interface DashboardCardsProps {
  username?: string
}

export function DashboardCards({ username }: DashboardCardsProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
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

  // Get profile completion suggestions
  const getCompletionSuggestions = () => {
    const suggestions = []
    if (!username) suggestions.push("Add a username")
    if (!settings?.email_notifications) suggestions.push("Enable notifications")
    if (!settings?.theme) suggestions.push("Set your preferred theme")
    return suggestions
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Welcome Back{username ? `, ${username}` : ""}!
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Completion Card */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Profile Completion</h3>
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            <Progress value={profileCompletion} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {profileCompletion}% of your profile is complete
            </p>
            {getCompletionSuggestions().length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Suggestions:</p>
                {getCompletionSuggestions().map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-muted-foreground"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/profile")}
            >
              Complete Profile
            </Button>
          </div>
        </div>

        {/* Settings Card */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Account Settings</h3>
            <Settings className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Theme: {settings?.theme || "Light"}
            </p>
            <p className="text-sm text-muted-foreground">
              Notifications:{" "}
              {settings?.email_notifications ? "Enabled" : "Disabled"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/settings")}
            >
              Manage Settings
            </Button>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Activity</h3>
            <Bell className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              <div className="space-y-2">
                {recentActivity.map((activity, index) => (
                  <p key={index} className="text-sm text-muted-foreground">
                    {activity}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent activity to show
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}