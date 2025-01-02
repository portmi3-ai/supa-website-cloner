import { Settings } from "@/types/settings.types"

interface UseProfileCompletionProps {
  username?: string
  settings?: Settings
}

export function useProfileCompletion({ username, settings }: UseProfileCompletionProps) {
  const calculateProfileCompletion = () => {
    let completed = 0
    let total = 3

    if (username) completed++
    if (settings?.email_notifications !== undefined) completed++
    if (settings?.theme) completed++

    return Math.round((completed / total) * 100)
  }

  const getCompletionSuggestions = () => {
    const suggestions = []
    if (!username) suggestions.push("Add a username")
    if (!settings?.email_notifications) suggestions.push("Enable notifications")
    if (!settings?.theme) suggestions.push("Set your preferred theme")
    return suggestions
  }

  return {
    profileCompletion: calculateProfileCompletion(),
    completionSuggestions: getCompletionSuggestions(),
  }
}