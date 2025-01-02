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

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <FederalContractsSearch />,
      },
      {
        path: "/analytics",
        element: <Analytics />,
      },
      {
        path: "/team",
        element: <Team />,
      },
      {
        path: "/market-intelligence",
        element: <MarketIntelligence />,
      },
      {
        path: "/workflows",
        element: <Workflows />,
      },
      {
        path: "/contracts",
        element: <Contracts />,
      },
      {
        path: "/proposals",
        element: <Proposals />,
      },
      {
        path: "/vendors",
        element: <Vendors />,
      },
      {
        path: "/saved-searches",
        element: <SavedSearches />,
      }
    ],
  },
])