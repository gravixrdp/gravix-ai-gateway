import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://bwnynwyoojfdjkvuibdp.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3bnlud3lvb2pmZGprdnVpYmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NjYwMDQsImV4cCI6MjA4OTI0MjAwNH0.OqWk_d7pU7t_ZlH-j1Y38d97vG75uW7x4H9k_XmSa7Y";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
