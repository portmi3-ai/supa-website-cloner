import { createBrowserRouter } from "react-router-dom"
import { AppLayout } from "@/components/AppLayout"
import { FederalContractsSearch } from "@/pages/FederalContractsSearch"
import Analytics from "@/pages/Analytics"
import Team from "@/pages/Team"
import MarketIntelligence from "@/pages/MarketIntelligence"
import Workflows from "@/pages/Workflows"

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
    ],
  },
])
