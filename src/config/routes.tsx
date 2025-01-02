import { createBrowserRouter } from "react-router-dom"
import { AppLayout } from "@/components/AppLayout"
import { RouteError } from "@/components/RouteError"
import { lazy } from "react"

const Index = lazy(() => import("@/pages/Index"))
const Auth = lazy(() => import("@/pages/Auth"))
const Contracts = lazy(() => import("@/pages/Contracts"))
const FederalContractsSearch = lazy(() => import("@/pages/FederalContractsSearch"))
const SavedSearches = lazy(() => import("@/pages/SavedSearches"))
const Proposals = lazy(() => import("@/pages/Proposals"))
const Documents = lazy(() => import("@/pages/Documents"))
const Analytics = lazy(() => import("@/pages/Analytics"))
const MarketIntelligence = lazy(() => import("@/pages/MarketIntelligence"))
const Team = lazy(() => import("@/pages/Team"))
const Settings = lazy(() => import("@/pages/Settings"))
const Help = lazy(() => import("@/pages/Help"))
const Notifications = lazy(() => import("@/pages/Notifications"))
const Profile = lazy(() => import("@/pages/Profile"))
const Vendors = lazy(() => import("@/pages/Vendors"))
const Workflows = lazy(() => import("@/pages/Workflows"))

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <Index />,
        errorElement: <RouteError />,
      },
      {
        path: "auth",
        element: <Auth />,
        errorElement: <RouteError />,
      },
      {
        path: "contracts",
        element: <Contracts />,
        errorElement: <RouteError />,
      },
      {
        path: "federal-contracts/search",
        element: <FederalContractsSearch />,
        errorElement: <RouteError />,
      },
      {
        path: "saved-searches",
        element: <SavedSearches />,
        errorElement: <RouteError />,
      },
      {
        path: "proposals",
        element: <Proposals />,
        errorElement: <RouteError />,
      },
      {
        path: "documents",
        element: <Documents />,
        errorElement: <RouteError />,
      },
      {
        path: "analytics",
        element: <Analytics />,
        errorElement: <RouteError />,
      },
      {
        path: "market-intelligence",
        element: <MarketIntelligence />,
        errorElement: <RouteError />,
      },
      {
        path: "team",
        element: <Team />,
        errorElement: <RouteError />,
      },
      {
        path: "settings",
        element: <Settings />,
        errorElement: <RouteError />,
      },
      {
        path: "help",
        element: <Help />,
        errorElement: <RouteError />,
      },
      {
        path: "notifications",
        element: <Notifications />,
        errorElement: <RouteError />,
      },
      {
        path: "profile",
        element: <Profile />,
        errorElement: <RouteError />,
      },
      {
        path: "vendors",
        element: <Vendors />,
        errorElement: <RouteError />,
      },
      {
        path: "workflows",
        element: <Workflows />,
        errorElement: <RouteError />,
      },
    ],
  },
])