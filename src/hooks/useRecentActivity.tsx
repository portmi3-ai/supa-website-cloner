import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export function useRecentActivity(userId?: string) {
  const [recentActivity, setRecentActivity] = useState<string[]>([])

  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel("dashboard-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        () => {
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
          filter: `id=eq.${userId}`,
        },
        () => {
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
  }, [userId])

  return recentActivity
}