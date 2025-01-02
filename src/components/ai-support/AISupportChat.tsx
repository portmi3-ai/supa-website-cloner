import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Loader2, Send, Bot, Clock } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AISupportChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number | null>(null)

  useEffect(() => {
    if (rateLimitCountdown && rateLimitCountdown > 0) {
      const timer = setTimeout(() => {
        setRateLimitCountdown(prev => prev ? prev - 1 : null)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (rateLimitCountdown === 0) {
      setRateLimitCountdown(null)
    }
  }, [rateLimitCountdown])

  const handleRateLimitError = () => {
    setRateLimitCountdown(60)
    toast.error('Rate limit reached. Please wait a moment before trying again.')
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const newMessage: Message = { 
      role: 'user', 
      content: input,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
    setInput('')
    setIsLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('ai-support', {
        body: { messages: [...messages, newMessage] }
      })

      if (error) {
        if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
          handleRateLimitError()
        } else {
          toast.error('Failed to get response. Please try again.')
        }
        throw error
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 p-4 border-b">
        <Bot className="h-5 w-5 text-primary animate-pulse" />
        <h2 className="text-lg font-semibold">AI Support Assistant</h2>
        {rateLimitCountdown !== null && (
          <span className="ml-auto text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Please wait {rateLimitCountdown}s
          </span>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              } animate-fade-in`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 transition-all duration-200 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-4 hover:shadow-lg hover:-translate-y-0.5'
                    : 'bg-muted mr-4 hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                <div className="mb-1">{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {format(message.timestamp, 'HH:mm')}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-muted rounded-lg p-3 mr-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">AI is typing...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={rateLimitCountdown !== null 
            ? `Rate limit reached. Please wait ${rateLimitCountdown}s...` 
            : "Type your message..."}
          disabled={isLoading || rateLimitCountdown !== null}
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
        />
        <Button 
          type="submit" 
          disabled={isLoading || !input.trim() || rateLimitCountdown !== null}
          className="transition-all duration-200 hover:scale-105"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  )
}