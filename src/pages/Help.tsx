import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileQuestion, HeadphonesIcon, MessageCircle } from "lucide-react"

const Help = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Help Center</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Browse our comprehensive documentation and guides. Coming soon.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileQuestion className="h-5 w-5 mr-2" />
                FAQs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Find answers to commonly asked questions. Coming soon.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Support Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Chat with our support team in real-time. Coming soon.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HeadphonesIcon className="h-5 w-5 mr-2" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get in touch with our support team. Coming soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Help