import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function ContractAnalysis() {
  const [contractText, setContractText] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const analyzeContract = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.functions.invoke("analyze-contract", {
        body: { text: contractText }
      })

      if (error) throw error
      setAnalysis(data.analysis)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze contract. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Contract Analysis</h3>
      <Textarea
        placeholder="Paste contract text here..."
        value={contractText}
        onChange={(e) => setContractText(e.target.value)}
        className="min-h-[200px]"
      />
      <Button 
        onClick={analyzeContract}
        disabled={!contractText || loading}
        className="w-full"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Analyze Contract
      </Button>
      {analysis && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <pre className="whitespace-pre-wrap">{analysis}</pre>
        </div>
      )}
    </Card>
  )
}