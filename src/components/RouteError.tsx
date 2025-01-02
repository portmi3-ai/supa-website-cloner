import { useRouteError } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export function RouteError() {
  const error = useRouteError() as Error

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md p-6 space-y-4">
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Route Error</h2>
        </div>
        <p className="text-muted-foreground">
          {error?.message || "An error occurred while loading this route"}
        </p>
        <div className="flex space-x-2">
          <Button onClick={() => window.location.reload()}>
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            Go to homepage
          </Button>
        </div>
      </Card>
    </div>
  )
}