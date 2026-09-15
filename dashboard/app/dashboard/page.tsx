"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Clock,
  KeyRound,
  Zap,
  Activity,
  ArrowUpRight,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState({
    spent5h: 120, // cents
    limit5h: 500, // cents
    spentWeek: 850,
    limitWeek: 3500,
    plan: "Pro Developer",
    activeKeys: 2,
  });
  const [copied, setCopied] = useState(false);

  const percent5h = Math.min(100, Math.round((stats.spent5h / stats.limit5h) * 100));
  const percentWeek = Math.min(100, Math.round((stats.spentWeek / stats.limitWeek) * 100));

  const copyUrl = () => {
    navigator.clipboard.writeText("https://api.gravixhost.app/v1");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Developer Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time quota monitoring and quickstart endpoints for your workspace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {stats.plan} Active
          </span>
          <Link
            href="/dashboard/keys"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition-all"
          >
            + Create API Key
          </Link>
        </div>
      </div>

      {/* Quota Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 5-Hour Rolling Limit */}
        <div className="rounded-3xl border border-white/10 bg-[#0F111C] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">5-Hour Rolling Limit</h3>
                <p className="text-[11px] text-slate-400">Resets automatically in 2h 45m</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-300">
              ₹{(stats.spent5h / 100).toFixed(2)} / ₹{(stats.limit5h / 100).toFixed(2)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${percent5h}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>{percent5h}% consumed</span>
              <span>₹{((stats.limit5h - stats.spent5h) / 100).toFixed(2)} remaining</span>
            </div>
          </div>
        </div>

        {/* Weekly Quota Cap */}
        <div className="rounded-3xl border border-white/10 bg-[#0F111C] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Weekly Quota Cap</h3>
                <p className="text-[11px] text-slate-400">7-day rolling allocation</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-purple-300">
              ₹{(stats.spentWeek / 100).toFixed(2)} / ₹{(stats.limitWeek / 100).toFixed(2)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${percentWeek}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>{percentWeek}% consumed</span>
              <span>₹{((stats.limitWeek - stats.spentWeek) / 100).toFixed(2)} remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Configuration Card */}
      <div className="rounded-3xl border border-white/10 bg-[#0F111C] p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="h-4 w-4 text-indigo-400" />
          Global Gateway Connection Endpoints
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-[#08090E] border border-white/5 p-4 space-y-2">
            <span className="text-xs font-semibold text-slate-400">OpenAI & Cursor Base URL</span>
            <div className="flex items-center justify-between font-mono text-xs text-indigo-300 bg-white/5 p-2 rounded-lg">
              <span>https://api.gravixhost.app/v1</span>
              <button onClick={copyUrl} className="text-slate-400 hover:text-white">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-[#08090E] border border-white/5 p-4 space-y-2">
            <span className="text-xs font-semibold text-slate-400">Anthropic Claude Code URL</span>
            <div className="flex items-center justify-between font-mono text-xs text-purple-300 bg-white/5 p-2 rounded-lg">
              <span>https://api.gravixhost.app/v1</span>
              <button onClick={copyUrl} className="text-slate-400 hover:text-white">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
