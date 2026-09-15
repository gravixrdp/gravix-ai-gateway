export interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  DEFAULT_UPSTREAM_URL?: string;
}

export interface AuthResult {
  valid: boolean;
  error?: string;
  code?: string;
  user_id?: string;
  key_id?: string;
  plan_id?: string;
  spent_5h_cents?: number;
  limit_5h_cents?: number;
  spent_week_cents?: number;
  limit_week_cents?: number;
  resets_in_seconds?: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  owned_by: string;
  context_length: number;
  pricing: {
    input_cents_per_m: number;
    output_cents_per_m: number;
  };
  supported_endpoints: ("openai" | "anthropic")[];
}
