// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tcskoshdkyilkxtxwsuq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjc2tvc2hka3lpbGt4dHh3c3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NTAzMDIsImV4cCI6MjA1MTMyNjMwMn0.z2xo8Fqnqh9GmUbIoKGp6AFP60-vE5jscFsVY6Mfdes";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);