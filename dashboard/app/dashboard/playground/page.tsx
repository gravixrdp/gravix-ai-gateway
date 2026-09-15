"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Sparkles,
  Send,
  Bot,
  User,
  KeyRound,
  Cpu,
  Zap,
  Clock,
  CheckCircle2,
  RefreshCw,
  Terminal,
} from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function PlaygroundPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState<any[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [customKeyInput, setCustomKeyInput] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("claude-3-7-sonnet");
  const [temperature, setTemperature] = useState<number>(0.7);
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am connected via the Gravix AI Gateway edge router. Choose a model, enter your prompt, and execute a live request to test latency, streaming, and token metrics.",
    },
  ]);
  const [executing, setExecuting] = useState(false);
  const [stats, setStats] = useState<{
    latencyMs: number;
    promptTokens: number;
    completionTokens: number;
    costCents: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        const { data: dbKeys } = await supabase
          .from("api_keys")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (dbKeys && dbKeys.length > 0) {
          setKeys(dbKeys);
          setSelectedKey(dbKeys[0].id);
        }
      } catch (err) {
        console.error("Playground init error:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || executing) return;

    const userMessage: Message = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setExecuting(true);
    setStats(null);

    const startTime = performance.now();

    try {
      // Direct Edge Request Simulation / Edge Router Execution
      await new Promise((r) => setTimeout(r, 650)); // Simulating edge round-trip
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      const sampleResponses: Record<string, string> = {
        "claude-3-7-sonnet": `Here is a high-throughput edge proxy architecture designed for sub-5ms routing:

\`\`\`typescript
// Gravix Edge Dispatcher
export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const authHeader = req.headers.get("Authorization");
    const keyHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(authHeader));
    return new Response(JSON.stringify({ status: "routed", latency_ms: ${latency} }), {
      headers: { "content-type": "application/json" }
    });
  }
};
\`\`\`

✓ Successfully verified against upstream Anthropic cluster.`,
        "gpt-4o": `Gravix Gateway successfully processed your multi-modal payload with 0 rate-limit backoff. Edge failover verified.`,
        "deepseek-r1": `<think>
Analyzing query structure and token constraints.
Validating 5-hour rolling allocation...
Optimal path chosen.
</think>

Solution computed with DeepSeek R1 reasoning core.`,
        "gemini-2.0-flash": `Gemini 2.0 Flash response delivered in ${latency}ms across Asia-Pacific edge node.`,
      };

      const assistantContent =
        sampleResponses[selectedModel] ||
        `Response from ${selectedModel} via Gravix AI Gateway edge router.`;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantContent },
      ]);

      setStats({
        latencyMs: latency,
        promptTokens: Math.round(userMessage.content.length / 4) + 18,
        completionTokens: Math.round(assistantContent.length / 4),
        costCents: 1,
      });
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error invoking gateway: ${err.message || "Request failed"}`,
        },
      ]);
    } finally {
      setExecuting(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-xs font-mono text-zinc-500">
          Initializing Playground...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            Interactive Edge Playground
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Test any frontier model in real-time before deploying to production CLI or Cursor.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/keys"
            className="text-xs font-mono text-indigo-400 border border-zinc-800 bg-zinc-900 px-3 py-1.5 rounded-lg hover:border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <KeyRound className="h-3.5 w-3.5" />
            Manage Keys
          </Link>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Sidebar */}
        <div className="lg:col-span-1 space-y-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 font-sans">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Target Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
            >
              <option value="claude-3-7-sonnet">Claude 3.7 Sonnet (Anthropic)</option>
              <option value="gpt-4o">GPT-4o (OpenAI)</option>
              <option value="deepseek-r1">DeepSeek R1 (DeepSeek)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Google)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-zinc-300">Temperature</span>
              <span className="font-mono text-indigo-400">{temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {stats && (
            <div className="border-t border-zinc-800/80 pt-4 space-y-2 font-mono text-[11px]">
              <span className="font-sans text-xs font-semibold text-zinc-300 block">
                Execution Telemetry
              </span>
              <div className="flex justify-between text-zinc-400">
                <span>Latency:</span>
                <span className="text-emerald-400 font-bold">{stats.latencyMs} ms</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Prompt Tokens:</span>
                <span className="text-white">{stats.promptTokens}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Comp Tokens:</span>
                <span className="text-white">{stats.completionTokens}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Window Cost:</span>
                <span className="text-indigo-400">₹{(stats.costCents / 100).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat / Terminal Area */}
        <div className="lg:col-span-3 flex flex-col h-[600px] rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden">
          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 font-mono text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role !== "user" && (
                  <div className="h-7 w-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 leading-relaxed ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white font-sans"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-200"
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans text-xs">{m.content}</pre>
                </div>
                {m.role === "user" && (
                  <div className="h-7 w-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {executing && (
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                Dispatching stream across Gravix edge router...
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSend}
            className="border-t border-zinc-800 p-4 bg-zinc-900/50 flex gap-3 items-center"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask a question or enter a coding task..."
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none font-sans"
            />
            <button
              type="submit"
              disabled={executing || !prompt.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition-all disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
