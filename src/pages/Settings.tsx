import { useAuth } from "@/hooks/useAuth"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useTheme } from "next-themes"

const Settings = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { setTheme, theme } = useTheme()

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

  // Update settings mutation
  const updateSettings = useMutation({
    mutationFn: async (newSettings: { email_notifications?: boolean; theme?: string }) => {
      const { error } = await supabase
        .from("settings")
        .update(newSettings)
        .eq("id", user?.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] })
      toast.success("Settings updated successfully")
    },
    onError: () => {
      toast.error("Failed to update settings")
    },
  })

  const handleThemeChange = (newTheme: string) => {
    updateSettings.mutate({ theme: newTheme })
    setTheme(newTheme)
  }

  const handleNotificationsChange = (enabled: boolean) => {
    updateSettings.mutate({ email_notifications: enabled })
  }

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
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Theme Preferences</h2>
            <div className="space-y-4">
              <RadioGroup
                value={theme || "system"}
                onValueChange={handleThemeChange}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2 p-4 rounded-lg border hover:border-primary transition-colors">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Light</Label>
                </div>
                <div className="flex items-center space-x-2 p-4 rounded-lg border hover:border-primary transition-colors">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Dark</Label>
                </div>
                <div className="flex items-center space-x-2 p-4 rounded-lg border hover:border-primary transition-colors">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">System</Label>
                </div>
              </RadioGroup>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-500">
                  Receive email updates about your account activity
                </p>
              </div>
              <Switch
                checked={settings?.email_notifications || false}
                onCheckedChange={handleNotificationsChange}
              />
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Settings