import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Index } from "@/pages/Index"
import { Contracts } from "@/pages/Contracts"
import { FederalContractsSearch } from "@/pages/FederalContractsSearch"
import { Settings } from "@/pages/Settings"
import { Notifications } from "@/pages/Notifications"
import { Profile } from "@/pages/Profile"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout><Index /></DashboardLayout>,
  },
  {
    path: "/contracts",
    element: <DashboardLayout><Contracts /></DashboardLayout>,
  },
  {
    path: "/federal-contracts/search",
    element: <DashboardLayout><FederalContractsSearch /></DashboardLayout>,
  },
  {
    path: "/settings",
    element: <DashboardLayout><Settings /></DashboardLayout>,
  },
  {
    path: "/notifications",
    element: <DashboardLayout><Notifications /></DashboardLayout>,
  },
  {
    path: "/profile",
    element: <DashboardLayout><Profile /></DashboardLayout>,
  },
])

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  )
}