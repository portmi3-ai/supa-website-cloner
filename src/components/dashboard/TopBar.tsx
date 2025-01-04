import { Button } from "@/components/ui/button"
import { LogOut, Bell } from "lucide-react"
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
    <div className="border-b border-border/40 backdrop-blur-sm bg-background/80">
      <div className="flex h-16 items-center gap-4">
        <div className="pl-2">
          <SidebarTrigger />
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-4 px-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-white">
              3
            </span>
          </Button>
          <span className="text-sm text-muted-foreground">
            {username || email}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}