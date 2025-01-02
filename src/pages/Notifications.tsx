import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

const Notifications = () => {
  const { user } = useAuth()

  useEffect(() => {
    const channel = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, (payload) => {
        toast.success("New notification received!")
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        <p>No new notifications at this time.</p>
      </div>
    </DashboardLayout>
  )
}

export default Notifications
