import { createClient } from "@supabase/supabase-js";

// Memory storage fallback for environments where localStorage/cookies are restricted
const memoryStorage: Record<string, string> = {};

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      // Access denied to localStorage
    }
    return memoryStorage[key] || null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      // Access denied to localStorage
    }
    memoryStorage[key] = value;
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch (e) {
      // Access denied to localStorage
    }
    delete memoryStorage[key];
  },
};

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://bwnynwyoojfdjkvuibdp.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3bnlud3lvb2pmZGprdnVpYmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NjYwMDQsImV4cCI6MjA4OTI0MjAwNH0.OqWk_d7pU7t_ZlH-j1Y38d97vG75uW7x4H9k_XmSa7Y";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: safeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
