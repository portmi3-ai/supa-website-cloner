import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Settings as SettingsIcon } from "lucide-react"
import type { Settings } from "@/integrations/supabase/types"

interface SettingsOverviewCardProps {
  settings?: Settings
  isLoading: boolean
}

export function SettingsOverviewCard({ settings, isLoading }: SettingsOverviewCardProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Account Settings</h3>
        <SettingsIcon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Theme: {settings?.theme || "Light"}
        </p>
        <p className="text-sm text-muted-foreground">
          Notifications: {settings?.email_notifications ? "Enabled" : "Disabled"}
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
  )
}