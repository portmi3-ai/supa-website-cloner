import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { toast } from "@/components/ui/use-toast"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface TopBarProps {
  username?: string
  email?: string
}

export function TopBar({ username, email }: TopBarProps) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    })
    navigate("/auth")
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <SidebarTrigger />
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {username || email}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}