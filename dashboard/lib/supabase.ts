import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://bwnynwyoojfdjkvuibdp.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3bnlud3lvb2pmZGprdnVpYmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NjYwMDQsImV4cCI6MjA4OTI0MjAwNH0.OqWk_d7pU7t_ZlH-j1Y38d97vG75uW7x4H9k_XmSa7Y";

// Create client with fallback-safe storage
function createSafeStorage() {
  const memory: Record<string, string> = {};
  return {
    getItem: (key: string): string | null => {
      try {
        if (typeof window !== "undefined") {
          return window.localStorage.getItem(key);
        }
      } catch (e) {
        // Fallback to memory
      }
      return memory[key] || null;
    },
    setItem: (key: string, value: string): void => {
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, value);
          return;
        }
      } catch (e) {
        // Fallback to memory
      }
      memory[key] = value;
    },
    removeItem: (key: string): void => {
      try {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(key);
          return;
        }
      } catch (e) {
        // Fallback to memory
      }
      delete memory[key];
    },
  };
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createSafeStorage(),
    autoRefreshToken: typeof window !== "undefined",
    persistSession: true,
    detectSessionInUrl: false,
  },
});
