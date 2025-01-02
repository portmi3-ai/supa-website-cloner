import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import Index from "@/pages/Index"
import Contracts from "@/pages/Contracts"
import { FederalContractsSearch } from "@/pages/FederalContractsSearch"
import SavedSearches from "@/pages/SavedSearches"
import Settings from "@/pages/Settings"
import Notifications from "@/pages/Notifications"
import Profile from "@/pages/Profile"
import Team from "@/pages/Team"
import Documents from "@/pages/Documents"
import Help from "@/pages/Help"
import Analytics from "@/pages/Analytics"
import Vendors from "@/pages/Vendors"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function RouteError() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h2 className="text-2xl font-bold text-destructive">
          Oops, something went wrong!
        </h2>
        <p className="text-muted-foreground">
          An error occurred while loading this page.
        </p>
        <Button onClick={() => window.location.reload()}>
          Try again
        </Button>
      </Card>
    </div>
  )
}

export const routes = [
  {
    path: "/",
    element: <DashboardLayout><Index /></DashboardLayout>,
    errorElement: <RouteError />,
  },
  {
    path: "/contracts",
    element: <DashboardLayout><Contracts /></DashboardLayout>,
    errorElement: <RouteError />,
  },
  {
    path: "/federal-contracts/search",
    element: <DashboardLayout><FederalContractsSearch /></DashboardLayout>,
    errorElement: <RouteError />,
  },
  {
    path: "/saved-searches",
    element: <DashboardLayout><SavedSearches /></DashboardLayout>,
    errorElement: <RouteError />,
  },
  {
    path: "/settings",
    element: <DashboardLayout><Settings /></DashboardLayout>,
    errorElement: <RouteError />,
  },
  {
    path: "/notifications",
    element: <DashboardLayout><Notifications /></DashboardLayout>,
    errorElement: <RouteError />,
  },
  {
    path: "/profile",
    element: <DashboardLayout><Profile /></DashboardLayout>,
    errorElement: <RouteError />,
  },
  {
    path: "/team",
    element: <DashboardLayout><Team /></DashboardLayout>,
    errorElement: <RouteError />,
  },
  {
    path: "/documents",
    element: <DashboardLayout><Documents /></DashboardLayout>,
    errorElement: <RouteError />,
  },
  {
    path: "/help",
    element: <DashboardLayout><Help /></DashboardLayout>,
    errorElement: <RouteError />,
  },
  {
    path: "/analytics",
    element: <DashboardLayout><Analytics /></DashboardLayout>,
    errorElement: <RouteError />,
  },
  {
    path: "/vendors",
    element: <DashboardLayout><Vendors /></DashboardLayout>,
    errorElement: <RouteError />,
  },
]
