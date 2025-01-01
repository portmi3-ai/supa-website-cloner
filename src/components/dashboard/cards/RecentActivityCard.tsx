import { Bell } from "lucide-react"

interface RecentActivityCardProps {
  activities: string[]
}

export function RecentActivityCard({ activities }: RecentActivityCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Recent Activity</h3>
        <Bell className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {activities.length > 0 ? (
          <div className="space-y-2">
            {activities.map((activity, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                {activity}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No recent activity to show
          </p>
        )}
      </div>
    </div>
  )
}