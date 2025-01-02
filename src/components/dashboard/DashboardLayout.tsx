import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
  username?: string
  email?: string
}

export function DashboardLayout({ children, username, email }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopBar username={username} email={email} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}