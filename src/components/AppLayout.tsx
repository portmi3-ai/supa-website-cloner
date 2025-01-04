import { Outlet } from "react-router-dom"
import { AppSidebar } from "./AppSidebar"
import { TopBar } from "./dashboard/TopBar"
import { SidebarProvider } from "@/components/ui/sidebar"

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background">
        <div className="flex h-screen overflow-hidden">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
            <TopBar />
            <main className="flex-1 overflow-y-auto">
              <div className="container h-full py-6">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}