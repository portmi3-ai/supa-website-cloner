import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/App"

const Notifications = () => {
  const { user } = useAuth()

  // Sample notifications - in a real app, these would come from your backend
  const notifications = [
    {
      id: 1,
      title: "Profile Update",
      message: "Your profile was successfully updated",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Settings Changed",
      message: "Your notification preferences have been saved",
      time: "1 day ago",
    },
  ]

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <Button variant="outline" size="sm">
            Mark all as read
          </Button>
        </div>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id}>
              <CardContent className="flex items-start gap-4 p-4">
                <div className="rounded-full bg-blue-100 p-2">
                  <Bell className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Notifications