import { createBrowserRouter } from "react-router-dom"
import { AppLayout } from "@/components/AppLayout"
import { FederalContractsSearch } from "@/pages/FederalContractsSearch"
import Analytics from "@/pages/Analytics"
import Team from "@/pages/Team"
import MarketIntelligence from "@/pages/MarketIntelligence"
import Workflows from "@/pages/Workflows"
import Contracts from "@/pages/Contracts"
import Proposals from "@/pages/Proposals"
import Vendors from "@/pages/Vendors"
import SavedSearches from "@/pages/SavedSearches"
import { RouteError } from "@/components/RouteError"

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      {
        path: "/",
        element: <FederalContractsSearch />,
        errorElement: <RouteError />,
      },
      {
        path: "/analytics",
        element: <Analytics />,
        errorElement: <RouteError />,
      },
      {
        path: "/team",
        element: <Team />,
        errorElement: <RouteError />,
      },
      {
        path: "/market-intelligence",
        element: <MarketIntelligence />,
        errorElement: <RouteError />,
      },
      {
        path: "/workflows",
        element: <Workflows />,
        errorElement: <RouteError />,
      },
      {
        path: "/contracts",
        element: <Contracts />,
        errorElement: <RouteError />,
      },
      {
        path: "/proposals",
        element: <Proposals />,
        errorElement: <RouteError />,
      },
      {
        path: "/vendors",
        element: <Vendors />,
        errorElement: <RouteError />,
      },
      {
        path: "/saved-searches",
        element: <SavedSearches />,
        errorElement: <RouteError />,
      },
      {
        path: "/federal-contracts/search",
        element: <FederalContractsSearch />,
        errorElement: <RouteError />,
      }
    ],
  },
])