import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TopBar } from "@/components/dashboard/TopBar"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { toast } from "sonner"

const Settings = () => {
  const { user } = useAuth()

  // Fetch user settings
  const { data: settings, isLoading } = useQuery({
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
      <TopBar username={user?.email} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div className="grid gap-6">
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold">Email Notifications</h2>
            <p className="text-sm text-gray-500">
              {settings?.email_notifications ? "Enabled" : "Disabled"}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold">Theme</h2>
            <p className="text-sm text-gray-500">
              {settings?.theme || "Not set"}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Settings
