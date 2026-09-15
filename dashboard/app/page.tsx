import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TerminalDemo } from "@/components/TerminalDemo";
import { TokenCalculator } from "@/components/TokenCalculator";
import {
  Zap,
  ShieldCheck,
  Cpu,
  Clock,
  QrCode,
  Coins,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  Lock,
} from "lucide-react";

export default function Home() {
  const models = [
    {
      id: "claude-3-7-sonnet",
      name: "Claude 3.7 Sonnet",
      provider: "Anthropic",
      context: "200k",
      speed: "Fast",
      tag: "Best for Coding",
    },
    {
      id: "gpt-4o",
      name: "GPT-4o Omnimodel",
      provider: "OpenAI",
      context: "128k",
      speed: "Ultra-Fast",
      tag: "Multi-Modal",
    },
    {
      id: "deepseek-r1",
      name: "DeepSeek R1",
      provider: "DeepSeek",
      context: "128k",
      speed: "Reasoning",
      tag: "Math & Logic",
    },
    {
      id: "gemini-2.0-flash",
      name: "Gemini 2.0 Flash",
      provider: "Google",
      context: "1M+",
      speed: "Real-time",
      tag: "High Context",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#090A0F]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24">
        {/* Glow Backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-gradient-to-tr from-indigo-600/20 to-violet-600/10 blur-[130px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-6 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Gravix AI Gateway v1.0 Live on Cloudflare Edge</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            One Unified API Key for{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
              Every Frontier AI Model
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            Drop-in API layer engineered for Claude Code CLI, Cursor, Cline, and autonomous AI agents. Predictable 5-hour rolling limits, 0 rate-limit bottlenecks, and instant UPI & USDT checkout.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login?signup=true"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all hover:scale-[1.02]"
            >
              Get Free Starter Key
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-base font-semibold text-slate-200 hover:bg-white/10 transition-all"
            >
              Integration Guide
            </Link>
          </div>

          {/* Interactive Terminal Demo */}
          <div className="mt-14 max-w-4xl mx-auto text-left">
            <TerminalDemo />
          </div>
        </div>
      </section>

      {/* Model Catalog Section */}
      <section id="models" className="py-20 border-t border-white/5 bg-[#0B0D16]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Frontier Model Catalog
            </span>
            <h2 className="mt-2 text-3xl font-bold text-white tracking-tight sm:text-4xl">
              Access the World&apos;s Best AI Models
            </h2>
            <p className="mt-3 text-slate-400 text-sm">
              All models available under a single endpoint with dual OpenAI & Anthropic protocol support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {models.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-white/10 bg-[#121524] p-6 hover:border-indigo-500/50 hover:bg-[#15192c] transition-all group"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {m.provider}
                  </span>
                  <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {m.tag}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {m.name}
                </h3>
                <p className="mt-1 font-mono text-xs text-slate-400">{m.id}</p>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span>Context: <strong className="text-slate-200">{m.context}</strong></span>
                  <span>Speed: <strong className="text-slate-200">{m.speed}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-white/5 bg-[#090A0F]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Engineered for Developers
            </span>
            <h2 className="mt-2 text-3xl font-bold text-white tracking-tight sm:text-4xl">
              Why Engineers Switch to Gravix
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-white/10 bg-[#11131F] p-8">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-6">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">5-Hour Rolling Windows</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Code heavily without arbitrary per-minute throttles. Your usage rolls over every 5 hours, keeping burst agent work uninterrupted.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#11131F] p-8">
              <div className="h-10 w-10 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-400 mb-6">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">&lt;5ms Edge Routing</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Powered by Cloudflare Workers and Mumbai ap-south-1 low-latency edge database for instant token streaming.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#11131F] p-8">
              <div className="h-10 w-10 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-400 mb-6">
                <QrCode className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Instant UPI & Crypto Topup</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                No mandatory international credit cards. Top up instantly with PhonePe, GPay, Paytm, or USDT on TRC20/BEP20.
              </p>
            </div>
          </div>

          {/* ROI Calculator */}
          <div className="mt-16 max-w-4xl mx-auto">
            <TokenCalculator />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 border-t border-white/5 bg-gradient-to-b from-[#0B0D16] to-[#090A0F]">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Start Coding with Gravix AI Gateway Today
          </h2>
          <p className="mt-4 text-slate-400 text-sm max-w-xl mx-auto">
            Generate your key in 30 seconds and supercharge your Claude Code CLI and Cursor workflows.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/login?signup=true"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all hover:scale-105"
            >
              Get Free API Key Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
