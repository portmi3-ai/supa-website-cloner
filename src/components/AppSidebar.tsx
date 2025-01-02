import { Home, FileText, Search, Users, Settings, Bell } from "lucide-react"
import { Sidebar, SidebarGroup, SidebarItem, SidebarMenu } from "@/components/ui/sidebar"
import { NotificationButton } from "@/components/notifications/NotificationButton"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarItem href="/" icon={Home}>
            Dashboard
          </SidebarItem>
          <SidebarItem href="/contracts" icon={FileText}>
            Contracts
          </SidebarItem>
          <SidebarItem href="/federal-contracts/search" icon={Search}>
            Federal Contracts Search
          </SidebarItem>
          <SidebarItem href="/team" icon={Users}>
            Team
          </SidebarItem>
          <SidebarItem href="/settings" icon={Settings}>
            Settings
          </SidebarItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup className="mt-auto">
        <NotificationButton />
      </SidebarGroup>
    </Sidebar>
  )
}