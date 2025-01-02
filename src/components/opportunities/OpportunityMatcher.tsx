import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

export function OpportunityMatcher() {
  const [vendorProfile, setVendorProfile] = useState("")
  const [matches, setMatches] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const findMatches = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.functions.invoke("match-opportunities", {
        body: { vendorProfile }
      })

      if (error) throw error
      setMatches(data.matches)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to find matching opportunities. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <CardHeader>
        <CardTitle>AI Opportunity Matcher</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter your vendor profile, capabilities, and preferences..."
          value={vendorProfile}
          onChange={(e) => setVendorProfile(e.target.value)}
          className="min-h-[200px]"
        />
        <Button 
          onClick={findMatches}
          disabled={!vendorProfile || isLoading}
          className="w-full"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Find Matching Opportunities
        </Button>
        {matches && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <pre className="whitespace-pre-wrap">{matches}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}