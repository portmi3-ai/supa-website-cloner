import "./App.css"
import { useAuth } from "@/hooks/useAuth"
import { AppLayout } from "@/components/AppLayout"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { router } from "./config/routes"
import { RouterProvider } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"

export { useAuth }

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App