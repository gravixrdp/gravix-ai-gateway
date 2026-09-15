import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bwnynwyoojfdjkvuibdp.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3bnlud3lvb2pmZGprdnVpYmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNTQyMDYsImV4cCI6MjEwMjYzMDIwNn0.HXYahk4phAkmiu3pJQ9bzGB2JNnN3rgRTK4xiG8Sa7Y";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
