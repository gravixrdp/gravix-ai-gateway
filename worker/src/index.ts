import { Env } from "./types";
import { extractApiKey, authenticateKey } from "./auth";
import { SUPPORTED_MODELS } from "./models";
import { handleChatCompletions, handleAnthropicMessages } from "./router";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Authorization, Content-Type, x-api-key, anthropic-version, HTTP-Referer, X-Title",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const clientIp = request.headers.get("cf-connecting-ip") || "127.0.0.1";

    // 1. Handle CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // 2. Health check
    if (url.pathname === "/health" || url.pathname === "/") {
      return new Response(
        JSON.stringify({
          status: "healthy",
          gateway: "Gravix AI Gateway Edge",
          version: "1.0.0",
          protocols: ["openai", "anthropic"],
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        }
      );
    }

    // 3. Models list (/v1/models)
    if (url.pathname === "/v1/models" && request.method === "GET") {
      const modelList = Object.values(SUPPORTED_MODELS).map((m) => ({
        id: m.id,
        object: "model",
        created: 1700000000,
        owned_by: m.owned_by,
        context_length: m.context_length,
        supported_endpoint_types: m.supported_endpoints,
      }));

      return new Response(
        JSON.stringify({ object: "list", data: modelList }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        }
      );
    }

    // 4. Authenticate Request
    const rawKey = extractApiKey(request);
    if (!rawKey) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Missing API Key. Provide 'Authorization: Bearer <key>' or 'x-api-key: <key>'",
            type: "invalid_request_error",
            code: "missing_api_key",
          },
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        }
      );
    }

    const { auth, keyHash } = await authenticateKey(rawKey, env);

    if (!auth.valid) {
      const statusCode = auth.code?.includes("limit_exceeded") ? 429 : 401;
      return new Response(
        JSON.stringify({
          error: {
            message: auth.error || "Authentication failed",
            type: auth.code ? "quota_exceeded_error" : "authentication_error",
            code: auth.code || "invalid_api_key",
            resets_in_seconds: auth.resets_in_seconds,
          },
        }),
        {
          status: statusCode,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        }
      );
    }

    // 5. Dashboard Usage Endpoint (/api/usage)
    if (url.pathname === "/api/usage" && request.method === "GET") {
      return new Response(
        JSON.stringify({
          userId: auth.user_id,
          planId: auth.plan_id,
          window5h: {
            usedCents: auth.spent_5h_cents,
            limitCents: auth.limit_5h_cents,
          },
          windowWeek: {
            usedCents: auth.spent_week_cents,
            limitCents: auth.limit_week_cents,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        }
      );
    }

    // 6. Route OpenAI Chat Completions (/v1/chat/completions)
    if (url.pathname === "/v1/chat/completions" && request.method === "POST") {
      const response = await handleChatCompletions(request, env, keyHash, clientIp);
      // Attach CORS headers
      const newHeaders = new Headers(response.headers);
      Object.entries(CORS_HEADERS).forEach(([k, v]) => newHeaders.set(k, v));
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    }

    // 7. Route Anthropic Native Messages (/v1/messages)
    if (url.pathname === "/v1/messages" && request.method === "POST") {
      const response = await handleAnthropicMessages(request, env, keyHash, clientIp);
      const newHeaders = new Headers(response.headers);
      Object.entries(CORS_HEADERS).forEach(([k, v]) => newHeaders.set(k, v));
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    }

    return new Response(
      JSON.stringify({ error: { message: "Endpoint not found", type: "not_found" } }),
      {
        status: 404,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      }
    );
  },
};
