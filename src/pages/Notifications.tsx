import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Check, X, AlertTriangle, AlertOctagon, Info, Bell } from "lucide-react"
import { useAuth } from "@/App"
import { supabase } from "@/integrations/supabase/client"
import { Notification, NotificationType, getNotificationIcon, getNotificationColor } from "@/lib/notifications"
import { format } from "date-fns"

const Notifications = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<NotificationType | 'all'>('all')

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .eq('user_id', user?.id)

      if (error) throw error

      // Convert the type from string to NotificationType
      const typedNotifications = data.map(notification => ({
        ...notification,
        type: notification.type as NotificationType
      }))

      setNotifications(typedNotifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: !currentState })
        .eq('id', id)

      if (error) throw error

      setNotifications(notifications.map(notification => 
        notification.id === id 
          ? { ...notification, is_read: !currentState }
          : notification
      ))

      toast({
        description: `Notification marked as ${!currentState ? 'read' : 'unread'}`,
      })
    } catch (error) {
      console.error('Error updating notification:', error)
      toast({
        title: "Error",
        description: "Failed to update notification",
        variant: "destructive",
      })
    }
  }

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user?.id)
        .eq('is_read', false)

      if (error) throw error

      setNotifications(notifications.map(notification => ({
        ...notification,
        is_read: true
      })))

      toast({
        description: "All notifications marked as read",
      })
    } catch (error) {
      console.error('Error updating notifications:', error)
      toast({
        title: "Error",
        description: "Failed to update notifications",
        variant: "destructive",
      })
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

      if (error) throw error

      setNotifications(notifications.filter(notification => notification.id !== id))
      toast({
        description: "Notification deleted",
      })
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotifications()

      // Subscribe to real-time updates
      const channel = supabase
        .channel('notifications_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('Change received!', payload)
            fetchNotifications()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user])

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <Check className={`h-4 w-4 ${getNotificationColor(type)}`} />;
      case 'warning':
        return <AlertTriangle className={`h-4 w-4 ${getNotificationColor(type)}`} />;
      case 'error':
        return <AlertOctagon className={`h-4 w-4 ${getNotificationColor(type)}`} />;
      default:
        return <Info className={`h-4 w-4 ${getNotificationColor(type)}`} />;
    }
  };

  const filteredNotifications = notifications.filter(
    notification => filter === 'all' || notification.type === filter
  )

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-accent' : ''}
            >
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter('info')}
              className={filter === 'info' ? 'bg-accent' : ''}
            >
              Info
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter('success')}
              className={filter === 'success' ? 'bg-accent' : ''}
            >
              Success
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter('warning')}
              className={filter === 'warning' ? 'bg-accent' : ''}
            >
              Warning
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter('error')}
              className={filter === 'error' ? 'bg-accent' : ''}
            >
              Error
            </Button>
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No notifications</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-colors ${
                  notification.is_read ? 'bg-muted/50' : 'bg-background'
                }`}
              >
                <CardContent className="flex items-start gap-4 p-4">
                  <div className={`rounded-full bg-${notification.type === 'info' ? 'blue' : notification.type}-100 p-2`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(notification.created_at), 'PPp')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => markAsRead(notification.id, notification.is_read)}
                      title={notification.is_read ? "Mark as unread" : "Mark as read"}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => deleteNotification(notification.id)}
                      title="Delete notification"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Notifications