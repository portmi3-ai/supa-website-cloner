import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AISupportChat } from "@/components/ai-support/AISupportChat"

export default function Help() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Help & Support</h1>
        <div className="mb-8">
          <p className="text-muted-foreground">
            Get instant help with our AI assistant or browse through our help resources.
          </p>
        </div>
        <AISupportChat />
      </div>
    </DashboardLayout>
  )
}