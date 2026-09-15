"use client";

import { useState } from "react";
import { Sparkles, TrendingDown, CheckCircle2 } from "lucide-react";

export function TokenCalculator() {
  const [tokensPerDay, setTokensPerDay] = useState<number>(2); // in Millions

  // Calculation (Official vs Gravix)
  // Claude 3.7 official ~ $15/M blended = ~$30/day * 30 = $900/mo (~₹75,000)
  const officialCostINR = Math.round(tokensPerDay * 30 * 1200);
  const gravixPlanCostINR = 999; // Pro Plan ₹999/mo
  const savingsPercent = Math.round(
    ((officialCostINR - gravixPlanCostINR) / officialCostINR) * 100
  );

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#11131F] to-[#0A0C14] p-8 shadow-2xl glow-border">
      <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
        <Sparkles className="h-4 w-4" />
        ROI & Cost Calculator
      </div>
      <h3 className="mt-2 text-2xl font-bold text-white tracking-tight">
        See How Much You Save Every Month
      </h3>
      <p className="mt-1 text-sm text-slate-400">
        Estimate your savings on Claude 3.7, GPT-4o, and DeepSeek coding workloads.
      </p>

      {/* Slider */}
      <div className="mt-8 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-300 font-medium">Daily Token Usage:</span>
          <span className="text-lg font-bold text-indigo-400 font-mono">
            {tokensPerDay} Million Tokens / day
          </span>
        </div>
        <input
          type="range"
          min="0.5"
          max="10"
          step="0.5"
          value={tokensPerDay}
          onChange={(e) => setTokensPerDay(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>500k Tokens (Light Dev)</span>
          <span>5M Tokens (Pro Coding)</span>
          <span>10M+ Tokens (Heavy Agents)</span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
          <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
            Official Lab Billing
          </span>
          <p className="mt-2 text-2xl font-bold font-mono text-white">
            ₹{officialCostINR.toLocaleString("en-IN")}
            <span className="text-xs text-slate-400 font-normal"> / mo</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">Pay-as-you-go credit card bills</p>
        </div>

        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-indigo-500/20 blur-xl" />
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
            Gravix Pro Plan
          </span>
          <p className="mt-2 text-2xl font-bold font-mono text-emerald-400">
            ₹999
            <span className="text-xs text-slate-300 font-normal"> / mo</span>
          </p>
          <p className="mt-1 text-xs text-indigo-200">Unlimited burst with 5h window</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <TrendingDown className="h-4 w-4" />
            Total Monthly Savings
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-white">
            {savingsPercent}%
            <span className="text-xs text-emerald-400 font-normal"> Saved</span>
          </p>
          <p className="mt-1 text-xs text-slate-300">
            Keep ₹{(officialCostINR - gravixPlanCostINR).toLocaleString("en-IN")} in your pocket
          </p>
        </div>
      </div>
    </div>
  );
}
