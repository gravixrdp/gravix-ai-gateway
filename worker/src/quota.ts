import { Env } from "./types";
import { SUPPORTED_MODELS } from "./models";

export interface UsageRecord {
  keyHash: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  statusCode: number;
  clientIp?: string;
}

export function calculateCostCents(
  modelId: string,
  promptTokens: number,
  completionTokens: number
): number {
  const model = SUPPORTED_MODELS[modelId] || {
    pricing: { input_cents_per_m: 50, output_cents_per_m: 150 },
  };

  const inputCost = (promptTokens / 1_000_000) * model.pricing.input_cents_per_m;
  const outputCost = (completionTokens / 1_000_000) * model.pricing.output_cents_per_m;

  // Minimum 1 cent unit or rounded ceiling
  const totalCents = Math.ceil(inputCost + outputCost);
  return Math.max(1, totalCents);
}

export async function recordUsageAsync(
  record: UsageRecord,
  env: Env
): Promise<void> {
  const costCents = calculateCostCents(
    record.model,
    record.promptTokens,
    record.completionTokens
  );

  const rpcUrl = `${env.SUPABASE_URL}/rest/v1/rpc/record_usage_and_deduct`;

  try {
    await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "apikey": env.SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${env.SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_key_hash: record.keyHash,
        p_model: record.model,
        p_prompt_tokens: record.promptTokens,
        p_completion_tokens: record.completionTokens,
        p_cost_cents: costCents,
        p_latency_ms: record.latencyMs,
        p_status_code: record.statusCode,
        p_ip: record.clientIp || "0.0.0.0",
      }),
    });
  } catch (err) {
    console.error("Failed to record async usage:", err);
  }
}
