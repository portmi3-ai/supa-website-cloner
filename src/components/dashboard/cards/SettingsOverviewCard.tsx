import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Settings as SettingsIcon } from "lucide-react"
import type { Settings } from "@/types/settings.types"

interface SettingsOverviewCardProps {
  settings?: Settings;
  isLoading: boolean;
}

export function SettingsOverviewCard({ settings, isLoading }: SettingsOverviewCardProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Settings Overview</h2>
          <SettingsIcon className="h-5 w-5 text-gray-500" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Settings Overview</h2>
        <SettingsIcon className="h-5 w-5 text-gray-500" />
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Email Notifications</p>
          <p className="font-medium">
            {settings?.email_notifications ? "Enabled" : "Disabled"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Theme</p>
          <p className="font-medium capitalize">
            {settings?.theme || "Not set"}
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/settings")}
        >
          Manage Settings
        </Button>
      </div>
    </div>
  )
}