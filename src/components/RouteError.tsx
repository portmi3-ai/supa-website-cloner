import { useRouteError, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export function RouteError() {
  const error = useRouteError() as Error
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Page Error</h2>
          <p className="mt-2 text-muted-foreground">
            {error?.message || "Sorry, we couldn't load this page"}
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate(-1)} variant="default">
            Go back
          </Button>
          <Button onClick={() => navigate("/")} variant="outline">
            Go to homepage
          </Button>
        </div>
      </div>
    </div>
  )
}