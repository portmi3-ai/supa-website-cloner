import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export function NotificationButton() {
  const navigate = useNavigate()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate("/notifications")}
      className="relative"
    >
      <Bell className="h-5 w-5" />
    </Button>
  )
}