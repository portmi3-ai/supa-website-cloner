import { Home, FileText, Search, Users, Settings, HelpCircle, FolderOpen, Bell, BarChart, Building2, Rocket } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { NotificationButton } from "@/components/notifications/NotificationButton"
import { Link } from "react-router-dom"

export function AppSidebar() {
  return (
    <Sidebar className="bg-gradient-to-b from-sidebar-background to-sidebar-accent border-r border-sidebar-border">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-2 px-4 py-6">
            <Rocket className="h-8 w-8 text-primary animate-pulse" />
            <span className="text-xl font-bold text-primary">Nova 3030</span>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/contracts" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Contracts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/federal-contracts/search" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200">
                    <Search className="mr-2 h-4 w-4" />
                    <span>Federal Contracts Search</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/team" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Team</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/vendors" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200">
                    <Building2 className="mr-2 h-4 w-4" />
                    <span>Vendors</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/analytics" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200">
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/documents" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    <span>Documents</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/help" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/settings" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <NotificationButton />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}