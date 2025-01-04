import { Outlet } from "react-router-dom"
import { AppSidebar } from "./AppSidebar"
import { TopBar } from "./dashboard/TopBar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Suspense } from "react"
import { LoadingSpinner } from "./ui/loading-spinner"

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto">
            <div className="w-full max-w-[1400px] mx-auto transition-all duration-300 px-6 py-6">
              <Suspense fallback={<LoadingSpinner />}>
                <Outlet />
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}