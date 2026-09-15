"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Check, Zap, Sparkles, ArrowRight } from "lucide-react";

export default function PricingPage() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  const plans = [
    {
      id: "free",
      name: "Free Starter",
      desc: "For testing and light experimentations",
      priceINR: 0,
      priceUSD: 0,
      limit5h: "₹50 limit / 5-hour window",
      limitWeek: "₹200 weekly quota",
      badge: "Free Forever",
      features: [
        "Access to DeepSeek V3 & Gemini 2.0 Flash",
        "OpenAI & Anthropic endpoint compatibility",
        "Community Telegram Support",
        "Standard rate limits",
      ],
      popular: false,
    },
    {
      id: "starter",
      name: "Dev Starter",
      desc: "Ideal for daily coding and lightweight agents",
      priceINR: 499,
      priceUSD: 6,
      limit5h: "₹150 limit / 5-hour window",
      limitWeek: "₹1,000 weekly quota",
      badge: "Starter",
      features: [
        "All Free features included",
        "Claude 3.5 Haiku & GPT-4o Mini",
        "DeepSeek R1 full reasoning",
        "High-priority upstream routing",
        "Email & Telegram Support",
      ],
      popular: false,
    },
    {
      id: "pro",
      name: "Pro Developer",
      desc: "The go-to plan for full-time Claude Code & Cursor power users",
      priceINR: 999,
      priceUSD: 12,
      limit5h: "₹500 limit / 5-hour window",
      limitWeek: "₹3,500 weekly quota",
      badge: "Most Popular",
      features: [
        "Unthrottled Claude 3.7 Sonnet & GPT-4o",
        "Full DeepSeek R1 & Gemini 2.0 Pro",
        "Priority <5ms Edge routing nodes",
        "Instant failover & auto-retry on 429",
        "1-on-1 Priority Developer Support",
      ],
      popular: true,
    },
    {
      id: "max",
      name: "Team Max",
      desc: "For autonomous multi-agent swarms and high-volume workloads",
      priceINR: 2499,
      priceUSD: 30,
      limit5h: "₹1,500 limit / 5-hour window",
      limitWeek: "₹10,000 weekly quota",
      badge: "Maximum Power",
      features: [
        "Huge 5-Hour and Weekly burst limits",
        "Dedicated VIP Upstream Channel Pool",
        "Multi-key team management & audit logs",
        "Custom model routing & fallback rules",
        "Direct 24/7 Slack/Telegram Engineering channel",
      ],
      popular: false,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#090A0F]">
      <Navbar />

      <main className="flex-1 py-16 px-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Transparent Pricing
          </span>
          <h1 className="mt-2 text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            Predictable Plans, Zero Surprises
          </h1>
          <p className="mt-4 text-slate-400 text-base">
            No unpredictable credit card overages. Choose a rolling-limit plan that scales with your coding velocity.
          </p>

          {/* Currency Toggle */}
          <div className="mt-8 inline-flex items-center gap-1 rounded-xl border border-white/10 bg-[#121524] p-1 text-xs font-semibold">
            <button
              onClick={() => setCurrency("INR")}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                currency === "INR" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              INR (₹ UPI)
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                currency === "USD" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              USD ($ Crypto/Card)
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${
                p.popular
                  ? "border-indigo-500/60 bg-[#121526] glow-primary shadow-2xl relative"
                  : "border-white/10 bg-[#0F111C] hover:border-white/20"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3.5 py-1 text-[11px] font-bold text-white shadow-md">
                  {p.badge}
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white">{p.name}</h3>
                <p className="mt-1 text-xs text-slate-400 min-h-[32px]">{p.desc}</p>

                <div className="mt-6">
                  <span className="text-3xl font-extrabold font-mono text-white">
                    {currency === "INR" ? `₹${p.priceINR}` : `$${p.priceUSD}`}
                  </span>
                  <span className="text-xs text-slate-400 font-medium"> / month</span>
                </div>

                {/* Limits Highlight */}
                <div className="mt-4 rounded-xl border border-white/5 bg-white/5 p-3 space-y-1 text-xs font-mono">
                  <div className="text-indigo-300 font-semibold">{p.limit5h}</div>
                  <div className="text-slate-400">{p.limitWeek}</div>
                </div>

                {/* Features List */}
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  {p.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <Link
                  href={p.priceINR === 0 ? "/login?signup=true" : `/dashboard/billing?plan=${p.id}`}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                    p.popular
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
                      : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                  }`}
                >
                  {p.priceINR === 0 ? "Get Started Free" : "Upgrade to Plan"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
