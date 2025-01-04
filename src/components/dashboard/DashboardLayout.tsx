import { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
  username?: string
  email?: string
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return <>{children}</>
}