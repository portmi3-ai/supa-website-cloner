import { Outlet } from "react-router-dom"
import { AppSidebar } from "./AppSidebar"
import { TopBar } from "./dashboard/TopBar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Suspense } from "react"
import { Loading } from "./ui/loading"

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 overflow-y-auto">
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}