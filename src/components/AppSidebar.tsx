import { Home, FileText, Search, Users, Settings, HelpCircle, FolderOpen, Bell } from "lucide-react"
import { Sidebar, SidebarGroup, SidebarMenu } from "@/components/ui/sidebar"
import { NotificationButton } from "@/components/notifications/NotificationButton"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarGroup>
        <SidebarMenu>
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link to="/contracts">
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Contracts
            </Button>
          </Link>
          <Link to="/federal-contracts/search">
            <Button variant="ghost" className="w-full justify-start">
              <Search className="mr-2 h-4 w-4" />
              Federal Contracts Search
            </Button>
          </Link>
          <Link to="/team">
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Team
            </Button>
          </Link>
          <Link to="/documents">
            <Button variant="ghost" className="w-full justify-start">
              <FolderOpen className="mr-2 h-4 w-4" />
              Documents
            </Button>
          </Link>
          <Link to="/help">
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="ghost" className="w-full justify-start">
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