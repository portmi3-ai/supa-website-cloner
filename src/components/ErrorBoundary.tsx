import React, { Component, ErrorInfo } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { AlertCircle } from "lucide-react"

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Something went wrong</h2>
          <p className="mt-2 text-muted-foreground">{error.message}</p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={resetError} variant="default">
            Try again
          </Button>
          <Button onClick={() => navigate("/")} variant="outline">
            Go to homepage
          </Button>
        </div>
      </div>
    </div>
  )
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error!}
          resetError={() => this.setState({ hasError: false, error: null })}
        />
      )
    }

    return this.props.children
  }
}