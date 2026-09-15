"use client";

import { BarChart3, TrendingUp, Cpu, Zap, Activity } from "lucide-react";

export default function UsagePage() {
  const modelBreakdown = [
    {
      model: "claude-3-7-sonnet",
      requests: 342,
      promptTokens: "1.42M",
      completionTokens: "420k",
      costINR: "₹184.20",
      percent: 65,
    },
    {
      model: "gpt-4o",
      requests: 120,
      promptTokens: "680k",
      completionTokens: "180k",
      costINR: "₹72.10",
      percent: 25,
    },
    {
      model: "deepseek-r1",
      requests: 84,
      promptTokens: "920k",
      completionTokens: "310k",
      costINR: "₹24.50",
      percent: 10,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Usage & Quota Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Detailed breakdown of your token consumption, latency, and costs across models.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-white/10 bg-[#0F111C] p-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <TrendingUp className="h-4 w-4 text-indigo-400" />
            Total Monthly Tokens
          </div>
          <div className="text-3xl font-bold font-mono text-white">3.93 Million</div>
          <p className="text-[11px] text-emerald-400 font-medium">+18% vs last week</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0F111C] p-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Zap className="h-4 w-4 text-emerald-400" />
            Average Edge Latency
          </div>
          <div className="text-3xl font-bold font-mono text-white">&lt;380ms</div>
          <p className="text-[11px] text-slate-400 font-medium">Cloudflare Mumbai ap-south-1</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0F111C] p-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Activity className="h-4 w-4 text-purple-400" />
            Total API Invocations
          </div>
          <div className="text-3xl font-bold font-mono text-white">546 Requests</div>
          <p className="text-[11px] text-indigo-400 font-medium">99.98% Success Rate</p>
        </div>
      </div>

      {/* Model Breakdown Table */}
      <div className="rounded-3xl border border-white/10 bg-[#0F111C] overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="h-4 w-4 text-indigo-400" />
            Consumption by Model
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#08090E] text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-3.5">Model</th>
                <th className="px-6 py-3.5">Invocations</th>
                <th className="px-6 py-3.5">Prompt Tokens</th>
                <th className="px-6 py-3.5">Completion Tokens</th>
                <th className="px-6 py-3.5">Equivalent Cost</th>
                <th className="px-6 py-3.5">Traffic Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {modelBreakdown.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-white">{row.model}</td>
                  <td className="px-6 py-4 text-slate-300">{row.requests}</td>
                  <td className="px-6 py-4 font-mono text-slate-400">{row.promptTokens}</td>
                  <td className="px-6 py-4 font-mono text-slate-400">{row.completionTokens}</td>
                  <td className="px-6 py-4 font-mono font-semibold text-emerald-400">{row.costINR}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${row.percent}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{row.percent}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
