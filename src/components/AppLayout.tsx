import { Outlet } from "react-router-dom"
import { AppSidebar } from "./AppSidebar"
import { TopBar } from "./dashboard/TopBar"

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AppSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}