interface DashboardCardsProps {
  username?: string
}

export function DashboardCards({ username }: DashboardCardsProps) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Welcome Back{username ? `, ${username}` : ""}!
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-2">Profile Completion</h3>
          <p className="text-sm text-muted-foreground">
            Complete your profile to get the most out of our platform.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-2">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">
            Track your recent actions and updates.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-2">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">
            Access frequently used features and tools.
          </p>
        </div>
      </div>
    </div>
  )
}