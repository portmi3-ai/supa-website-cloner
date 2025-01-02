import { Home, FileText, Search, Users, Settings, HelpCircle, FolderOpen, Bell, BarChart, Building2, Rocket } from "lucide-react"
import { Sidebar, SidebarGroup, SidebarMenu } from "@/components/ui/sidebar"
import { NotificationButton } from "@/components/notifications/NotificationButton"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  return (
    <Sidebar className="bg-gradient-to-b from-sidebar-background to-sidebar-accent border-r border-sidebar-border">
      <SidebarGroup>
        <div className="flex items-center gap-2 px-4 py-6">
          <Rocket className="h-8 w-8 text-primary animate-pulse" />
          <span className="text-xl font-bold text-primary">Nova 3030</span>
        </div>
        <SidebarMenu>
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link to="/contracts">
            <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <FileText className="mr-2 h-4 w-4" />
              Contracts
            </Button>
          </Link>
          <Link to="/federal-contracts/search">
            <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <Search className="mr-2 h-4 w-4" />
              Federal Contracts Search
            </Button>
          </Link>
          <Link to="/team">
            <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <Users className="mr-2 h-4 w-4" />
              Team
            </Button>
          </Link>
          <Link to="/vendors">
            <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <Building2 className="mr-2 h-4 w-4" />
              Vendors
            </Button>
          </Link>
          <Link to="/analytics">
            <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <BarChart className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </Link>
          <Link to="/documents">
            <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <FolderOpen className="mr-2 h-4 w-4" />
              Documents
            </Button>
          </Link>
          <Link to="/help">
            <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup className="mt-auto">
        <NotificationButton />
      </SidebarGroup>
    </Sidebar>
  )
}