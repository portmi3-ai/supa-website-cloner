import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useNavigate } from "react-router-dom"
import { User, AlertCircle } from "lucide-react"

interface ProfileCompletionCardProps {
  username?: string
  profileCompletion: number
  completionSuggestions: string[]
}

export function ProfileCompletionCard({
  username,
  profileCompletion,
  completionSuggestions,
}: ProfileCompletionCardProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Profile Completion</h3>
        <User className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-4">
        <Progress value={profileCompletion} className="h-2" />
        <p className="text-sm text-muted-foreground">
          {profileCompletion}% of your profile is complete
        </p>
        {completionSuggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Suggestions:</p>
            {completionSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-muted-foreground"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                {suggestion}
              </div>
            ))}
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/profile")}
        >
          Complete Profile
        </Button>
      </div>
    </div>
  )
}