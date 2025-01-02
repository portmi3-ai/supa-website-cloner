import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple rate limiting using a Map
const requestTimestamps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(clientId: string): boolean {
  const now = Date.now();
  const timestamps = requestTimestamps.get(clientId) || [];
  
  // Remove timestamps older than the window
  const recentTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);
  
  // Update timestamps
  requestTimestamps.set(clientId, recentTimestamps);
  
  return recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW;
}

function addRequest(clientId: string) {
  const timestamps = requestTimestamps.get(clientId) || [];
  timestamps.push(Date.now());
  requestTimestamps.set(clientId, timestamps);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const clientId = req.headers.get('x-client-info') || 'anonymous';

    if (isRateLimited(clientId)) {
      console.warn(`Rate limit exceeded for client: ${clientId}`);
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests. Please wait a moment before trying again.' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429
        }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid messages format');
    }

    console.log('Sending request to OpenAI with messages:', messages);

    // Add system message for coding assistance
    const systemMessage = {
      role: 'system',
      content: `You are a helpful AI coding assistant with expertise in:
- React and TypeScript
- Tailwind CSS for styling
- Shadcn/ui component library
- Supabase for backend functionality
- Modern web development best practices

When users ask coding questions:
1. Provide clear, concise explanations
2. Share code snippets when relevant
3. Follow React best practices
4. Use Tailwind CSS for styling
5. Leverage shadcn/ui components when possible
6. Consider Supabase integration where appropriate

Keep responses focused and practical.`
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      
      // Handle specific error cases
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'The AI service is currently busy. Please try again in a moment.' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 429
          }
        );
      }
      
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected OpenAI API response format:', data);
      throw new Error('Invalid response format from OpenAI API');
    }

    console.log('Received successful response from OpenAI');
    
    // Record successful request for rate limiting
    addRequest(clientId);
    
    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in AI support function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});