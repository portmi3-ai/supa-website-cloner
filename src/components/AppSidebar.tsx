import { BarChart, Bell, Home, HelpCircle, Settings, User, FileText, FileCheck, Files } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const navigate = useNavigate()

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      onClick: () => navigate("/"),
    },
    {
      title: "Contracts",
      icon: FileText,
      onClick: () => navigate("/contracts"),
    },
    {
      title: "Proposals",
      icon: FileCheck,
      onClick: () => navigate("/proposals"),
    },
    {
      title: "Documents",
      icon: Files,
      onClick: () => navigate("/documents"),
    },
    {
      title: "Analytics",
      icon: BarChart,
      onClick: () => navigate("/analytics"),
    },
    {
      title: "Profile",
      icon: User,
      onClick: () => navigate("/profile"),
    },
    {
      title: "Notifications",
      icon: Bell,
      onClick: () => navigate("/notifications"),
    },
    {
      title: "Settings",
      icon: Settings,
      onClick: () => navigate("/settings"),
    },
    {
      title: "Help",
      icon: HelpCircle,
      onClick: () => navigate("/help"),
    },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={item.onClick}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}