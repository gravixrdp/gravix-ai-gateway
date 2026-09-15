import { Env } from "./types";
import { recordUsageAsync } from "./quota";

export interface ChatRequestPayload {
  model: string;
  messages: Array<{ role: string; content: string | any }>;
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
}

export async function handleChatCompletions(
  request: Request,
  env: Env,
  keyHash: string,
  clientIp: string
): Promise<Response> {
  const startTime = Date.now();
  let body: ChatRequestPayload;

  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: { message: "Invalid JSON body", type: "invalid_request_error" } }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const model = body.model || "gpt-4o-mini";
  const isStream = Boolean(body.stream);

  // Upstream endpoint (Default to OpenRouter or configured upstream)
  const upstreamBase = env.DEFAULT_UPSTREAM_URL || "https://openrouter.ai/api/v1";
  const upstreamUrl = `${upstreamBase}/chat/completions`;

  // Estimate prompt tokens (~4 chars per token)
  const promptText = JSON.stringify(body.messages || []);
  const promptTokens = Math.max(1, Math.ceil(promptText.length / 4));

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": request.headers.get("Authorization") || "",
        "HTTP-Referer": "https://gravixhost.app",
        "X-Title": "Gravix AI Gateway",
      },
      body: JSON.stringify(body),
    });

    const latencyMs = Date.now() - startTime;

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      // Record failed request asynchronously
      recordUsageAsync(
        {
          keyHash,
          model,
          promptTokens,
          completionTokens: 0,
          latencyMs,
          statusCode: upstreamResponse.status,
          clientIp,
        },
        env
      );

      return new Response(errorText, {
        status: upstreamResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (isStream && upstreamResponse.body) {
      // Pass-through SSE Stream
      let completionTokens = 0;
      const { readable, writable } = new TransformStream({
        transform(chunk, controller) {
          controller.enqueue(chunk);
          // Estimate stream completion tokens
          completionTokens += Math.max(1, Math.ceil(chunk.byteLength / 8));
        },
        flush() {
          // Log usage after stream completes
          recordUsageAsync(
            {
              keyHash,
              model,
              promptTokens,
              completionTokens,
              latencyMs: Date.now() - startTime,
              statusCode: 200,
              clientIp,
            },
            env
          );
        },
      });

      upstreamResponse.body.pipeTo(writable);

      return new Response(readable, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Non-streaming response
    const resData: any = await upstreamResponse.json();
    const completionTokens = resData?.usage?.completion_tokens || 100;

    recordUsageAsync(
      {
        keyHash,
        model,
        promptTokens: resData?.usage?.prompt_tokens || promptTokens,
        completionTokens,
        latencyMs,
        statusCode: 200,
        clientIp,
      },
      env
    );

    return new Response(JSON.stringify(resData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: {
          message: `Gateway upstream error: ${err.message}`,
          type: "gateway_error",
        },
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function handleAnthropicMessages(
  request: Request,
  env: Env,
  keyHash: string,
  clientIp: string
): Promise<Response> {
  const startTime = Date.now();
  let body: any;

  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({
        type: "error",
        error: { type: "invalid_request_error", message: "Invalid JSON payload" },
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const model = body.model || "claude-3-5-sonnet";
  const isStream = Boolean(body.stream);
  const upstreamBase = env.DEFAULT_UPSTREAM_URL || "https://openrouter.ai/api/v1";

  // Convert Anthropic format messages into OpenAI format for universal routing
  const openaiMessages = (body.messages || []).map((m: any) => ({
    role: m.role,
    content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
  }));

  if (body.system) {
    openaiMessages.unshift({ role: "system", content: body.system });
  }

  const promptTokens = Math.max(1, Math.ceil(JSON.stringify(openaiMessages).length / 4));

  try {
    const upstreamResponse = await fetch(`${upstreamBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": request.headers.get("Authorization") || `Bearer ${request.headers.get("x-api-key")}`,
        "HTTP-Referer": "https://gravixhost.app",
        "X-Title": "Gravix AI Gateway",
      },
      body: JSON.stringify({
        model: model,
        messages: openaiMessages,
        stream: isStream,
        max_tokens: body.max_tokens || 4096,
        temperature: body.temperature || 0.7,
      }),
    });

    const latencyMs = Date.now() - startTime;

    if (!upstreamResponse.ok) {
      const errText = await upstreamResponse.text();
      return new Response(errText, {
        status: upstreamResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (isStream && upstreamResponse.body) {
      // Stream directly
      const { readable, writable } = new TransformStream({
        transform(chunk, controller) {
          controller.enqueue(chunk);
        },
        flush() {
          recordUsageAsync(
            {
              keyHash,
              model,
              promptTokens,
              completionTokens: 200,
              latencyMs: Date.now() - startTime,
              statusCode: 200,
              clientIp,
            },
            env
          );
        },
      });

      upstreamResponse.body.pipeTo(writable);
      return new Response(readable, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const resJson: any = await upstreamResponse.json();
    const contentText = resJson.choices?.[0]?.message?.content || "";

    // Convert back to Anthropic JSON response format
    const anthropicResponse = {
      id: `msg_${Date.now()}`,
      type: "message",
      role: "assistant",
      content: [{ type: "text", text: contentText }],
      model: model,
      stop_reason: "end_turn",
      stop_sequence: null,
      usage: {
        input_tokens: resJson.usage?.prompt_tokens || promptTokens,
        output_tokens: resJson.usage?.completion_tokens || Math.ceil(contentText.length / 4),
      },
    };

    recordUsageAsync(
      {
        keyHash,
        model,
        promptTokens: anthropicResponse.usage.input_tokens,
        completionTokens: anthropicResponse.usage.output_tokens,
        latencyMs,
        statusCode: 200,
        clientIp,
      },
      env
    );

    return new Response(JSON.stringify(anthropicResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        type: "error",
        error: { type: "api_error", message: err.message },
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
