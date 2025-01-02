import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"

export function useSaveSearch() {
  const { toast } = useToast()
  const { user } = useAuth()

  const saveSearch = async (name: string, searchCriteria: any) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save searches",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase
        .from("saved_searches")
        .insert({
          name,
          search_criteria: searchCriteria,
          user_id: user.id,
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Search criteria saved successfully",
      })
    } catch (error) {
      console.error("Error saving search:", error)
      toast({
        title: "Error",
        description: "Failed to save search. Please try again.",
        variant: "destructive",
      })
    }
  }

  return { saveSearch }
}