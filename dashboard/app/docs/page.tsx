import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Terminal, Copy, CheckCircle, Code2, BookOpen } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#090A0F]">
      <Navbar />

      <main className="flex-1 py-14 px-6 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="border-b border-white/5 pb-8 mb-10">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="h-4 w-4" />
            Developer Documentation
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
            Quickstart Integration Guide
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Set up Gravix AI Gateway in 30 seconds with any frontier coding tool or agent framework.
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1: Claude Code CLI */}
          <section id="claude-code" className="rounded-2xl border border-white/10 bg-[#0F111C] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="h-5 w-5 text-indigo-400" />
              1. Claude Code CLI Setup
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300">
              Run Anthropic&apos;s official Claude Code CLI natively through your Gravix API key.
            </p>

            <div className="mt-4 rounded-xl bg-[#08090E] border border-white/5 p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
              <pre>{`# 1. Export the Gravix endpoint and your API key
export ANTHROPIC_BASE_URL="https://api.gravixhost.app/v1"
export ANTHROPIC_API_KEY="grx_live_your_actual_key_here"

# 2. Launch Claude Code CLI
claude`}</pre>
            </div>
          </section>

          {/* Section 2: Cursor IDE */}
          <section id="cursor" className="rounded-2xl border border-white/10 bg-[#0F111C] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Code2 className="h-5 w-5 text-purple-400" />
              2. Cursor IDE Integration
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300">
              Use Claude 3.7 Sonnet, GPT-4o, and DeepSeek R1 directly inside Cursor editor.
            </p>

            <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-300">
              <p>1. Open Cursor <strong>Settings &rarr; Models &rarr; OpenAI API Key</strong></p>
              <p>2. Toggle <strong>Override OpenAI Base URL</strong> to <code className="text-indigo-300 bg-white/5 px-2 py-0.5 rounded">https://api.gravixhost.app/v1</code></p>
              <p>3. Enter your Gravix Key <code className="text-indigo-300 bg-white/5 px-2 py-0.5 rounded">grx_live_...</code> in the API Key box.</p>
              <p>4. Enable model names: <code className="text-emerald-400 font-mono">claude-3-7-sonnet</code>, <code className="text-emerald-400 font-mono">gpt-4o</code>, <code className="text-emerald-400 font-mono">deepseek-r1</code>.</p>
            </div>
          </section>

          {/* Section 3: Python OpenAI & Anthropic SDK */}
          <section id="python" className="rounded-2xl border border-white/10 bg-[#0F111C] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Code2 className="h-5 w-5 text-emerald-400" />
              3. Python & Node.js SDKs
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300">
              Standard OpenAI Python client works out of the box with zero modifications.
            </p>

            <div className="mt-4 rounded-xl bg-[#08090E] border border-white/5 p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
              <pre>{`from openai import OpenAI

client = OpenAI(
    base_url="https://api.gravixhost.app/v1",
    api_key="grx_live_your_actual_key_here",
)

stream = client.chat.completions.create(
    model="claude-3-7-sonnet",
    messages=[{"role": "user", "content": "Refactor this SQL query for high scale."}],
    stream=True,
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)`}</pre>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
