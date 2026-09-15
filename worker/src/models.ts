import { ModelConfig } from "./types";

export const SUPPORTED_MODELS: Record<string, ModelConfig> = {
  // Claude Models
  "claude-3-7-sonnet": {
    id: "claude-3-7-sonnet",
    name: "Claude 3.7 Sonnet (Hybrid Thinking)",
    owned_by: "anthropic",
    context_length: 200000,
    pricing: { input_cents_per_m: 300, output_cents_per_m: 1500 },
    supported_endpoints: ["openai", "anthropic"],
  },
  "claude-3-5-sonnet": {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    owned_by: "anthropic",
    context_length: 200000,
    pricing: { input_cents_per_m: 300, output_cents_per_m: 1500 },
    supported_endpoints: ["openai", "anthropic"],
  },
  "claude-3-5-haiku": {
    id: "claude-3-5-haiku",
    name: "Claude 3.5 Haiku",
    owned_by: "anthropic",
    context_length: 200000,
    pricing: { input_cents_per_m: 80, output_cents_per_m: 400 },
    supported_endpoints: ["openai", "anthropic"],
  },

  // OpenAI Models
  "gpt-4o": {
    id: "gpt-4o",
    name: "GPT-4o Omnimodel",
    owned_by: "openai",
    context_length: 128000,
    pricing: { input_cents_per_m: 250, output_cents_per_m: 1000 },
    supported_endpoints: ["openai"],
  },
  "gpt-4o-mini": {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    owned_by: "openai",
    context_length: 128000,
    pricing: { input_cents_per_m: 15, output_cents_per_m: 60 },
    supported_endpoints: ["openai"],
  },
  "o3-mini": {
    id: "o3-mini",
    name: "o3-mini Reasoning",
    owned_by: "openai",
    context_length: 200000,
    pricing: { input_cents_per_m: 110, output_cents_per_m: 440 },
    supported_endpoints: ["openai"],
  },

  // DeepSeek & Open Source Models
  "deepseek-r1": {
    id: "deepseek-r1",
    name: "DeepSeek R1 (Full Reasoning)",
    owned_by: "deepseek",
    context_length: 128000,
    pricing: { input_cents_per_m: 55, output_cents_per_m: 219 },
    supported_endpoints: ["openai", "anthropic"],
  },
  "deepseek-v3": {
    id: "deepseek-v3",
    name: "DeepSeek V3 (671B MoE)",
    owned_by: "deepseek",
    context_length: 128000,
    pricing: { input_cents_per_m: 14, output_cents_per_m: 28 },
    supported_endpoints: ["openai", "anthropic"],
  },

  // Gemini Models
  "gemini-2.0-flash": {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    owned_by: "google",
    context_length: 1048576,
    pricing: { input_cents_per_m: 10, output_cents_per_m: 40 },
    supported_endpoints: ["openai", "anthropic"],
  },
  "gemini-2.0-pro": {
    id: "gemini-2.0-pro",
    name: "Gemini 2.0 Pro (2M Context)",
    owned_by: "google",
    context_length: 2097152,
    pricing: { input_cents_per_m: 125, output_cents_per_m: 500 },
    supported_endpoints: ["openai", "anthropic"],
  },
};
