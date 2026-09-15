"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

export function TerminalDemo() {
  const [activeTab, setActiveTab] = useState<"claude" | "cursor" | "python" | "curl">("claude");
  const [copied, setCopied] = useState(false);

  const snippets = {
    claude: `export ANTHROPIC_BASE_URL="https://api.gravixhost.app/v1"
export ANTHROPIC_API_KEY="grx_live_••••••••••••••••"

# Run Claude Code CLI natively
claude`,
    cursor: `// In Cursor Settings -> Models -> OpenAI API Key
Base URL: https://api.gravixhost.app/v1
API Key:  grx_live_••••••••••••••••

// Enable: claude-3-7-sonnet, gpt-4o, deepseek-r1`,
    python: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.gravixhost.app/v1",
    api_key="grx_live_••••••••••••••••",
)

response = client.chat.completions.create(
    model="claude-3-7-sonnet",
    messages=[{"role": "user", "content": "Write a high-throughput proxy in Go."}],
)
print(response.choices[0].message.content)`,
    curl: `curl https://api.gravixhost.app/v1/chat/completions \\
  -H "Authorization: Bearer grx_live_••••••••••••••••" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-r1",
    "messages": [{"role": "user", "content": "Explain quantum consensus"}]
  }'`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0C0E17] shadow-2xl overflow-hidden glow-primary">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#121524] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1">
            <Terminal className="h-3.5 w-3.5" /> quickstart.sh
          </span>
        </div>

        {/* Tab Selectors */}
        <div className="flex items-center gap-1 bg-[#090A0F] p-1 rounded-lg border border-white/5 text-xs font-medium">
          {(
            [
              { id: "claude", label: "Claude Code CLI" },
              { id: "cursor", label: "Cursor IDE" },
              { id: "python", label: "Python SDK" },
              { id: "curl", label: "cURL" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code Display */}
      <div className="p-5 font-mono text-xs md:text-sm text-slate-200 overflow-x-auto leading-relaxed">
        <pre className="text-emerald-400/90">{snippets[activeTab]}</pre>
      </div>
    </div>
  );
}
