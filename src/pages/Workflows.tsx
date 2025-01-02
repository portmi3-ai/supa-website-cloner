import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Bell, Calendar, FileCheck, Mail } from "lucide-react"

interface Workflow {
  id: string
  name: string
  description: string
  enabled: boolean
  icon: JSX.Element
}

export default function Workflows() {
  const { toast } = useToast()
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "deadline-reminders",
      name: "Deadline Reminders",
      description: "Get notified about upcoming proposal deadlines",
      enabled: true,
      icon: <Calendar className="h-6 w-6" />,
    },
    {
      id: "compliance-checks",
      name: "Compliance Checks",
      description: "Automated compliance verification for proposals",
      enabled: false,
      icon: <FileCheck className="h-6 w-6" />,
    },
    {
      id: "email-notifications",
      name: "Email Notifications",
      description: "Receive updates about contract changes",
      enabled: true,
      icon: <Mail className="h-6 w-6" />,
    },
    {
      id: "opportunity-alerts",
      name: "Opportunity Alerts",
      description: "Get notified about new relevant opportunities",
      enabled: true,
      icon: <Bell className="h-6 w-6" />,
    },
  ])

  const toggleWorkflow = async (workflowId: string) => {
    try {
      const workflow = workflows.find((w) => w.id === workflowId)
      if (!workflow) return

      const { error } = await supabase.functions.invoke("toggle-workflow", {
        body: { workflowId, enabled: !workflow.enabled }
      })

      if (error) throw error

      setWorkflows(workflows.map((w) =>
        w.id === workflowId ? { ...w, enabled: !w.enabled } : w
      ))

      toast({
        title: `${workflow.name} ${!workflow.enabled ? "enabled" : "disabled"}`,
        description: `Successfully ${!workflow.enabled ? "enabled" : "disabled"} the workflow.`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update workflow settings. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Automated Workflows</h1>
        <Button variant="outline">Create Custom Workflow</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-lg bg-primary/10">
                {workflow.icon}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{workflow.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={workflow.id}
                      checked={workflow.enabled}
                      onCheckedChange={() => toggleWorkflow(workflow.id)}
                    />
                    <Label htmlFor={workflow.id} className="sr-only">
                      {workflow.name}
                    </Label>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {workflow.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}