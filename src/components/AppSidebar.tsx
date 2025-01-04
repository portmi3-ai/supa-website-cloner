import { Home, FileText, Search, Users, Settings, HelpCircle, FolderOpen, Bell, BarChart, Building2, Rocket } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { NotificationButton } from "@/components/notifications/NotificationButton"
import { Link, useLocation } from "react-router-dom"

export function AppSidebar() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <Sidebar 
      className="bg-gradient-to-b from-sidebar-background to-sidebar-accent border-r border-sidebar-border transition-all duration-300 flex-shrink-0"
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-2 px-4 py-6">
            <Rocket className="h-8 w-8 text-primary animate-pulse" />
            <span className="text-xl font-bold text-primary transition-opacity duration-300 group-[[data-collapsible=icon]]:opacity-0">Nova 3030</span>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/" 
                    className={`w-full justify-start transition-all duration-200 ${
                      isActive("/") 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/contracts" 
                    className={`w-full justify-start transition-all duration-200 ${
                      isActive("/contracts") 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Contracts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/federal-contracts/search" 
                    className={`w-full justify-start transition-all duration-200 ${
                      isActive("/federal-contracts/search") 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    <span>Federal Contracts Search</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/team" 
                    className={`w-full justify-start transition-all duration-200 ${
                      isActive("/team") 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>Team</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/vendors" 
                    className={`w-full justify-start transition-all duration-200 ${
                      isActive("/vendors") 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    <span>Vendors</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/analytics" 
                    className={`w-full justify-start transition-all duration-200 ${
                      isActive("/analytics") 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/documents" 
                    className={`w-full justify-start transition-all duration-200 ${
                      isActive("/documents") 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    <span>Documents</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/help" 
                    className={`w-full justify-start transition-all duration-200 ${
                      isActive("/help") 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/settings" 
                    className={`w-full justify-start transition-all duration-200 ${
                      isActive("/settings") 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
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