"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Clock,
  KeyRound,
  Zap,
  Activity,
  Copy,
  Check,
  Plus,
  Terminal,
  ArrowUpRight,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState("");

  const loadData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const { data: dbData, error } = await supabase.rpc(
        "get_user_dashboard_data"
      );
      if (error) throw error;
      setData(dbData);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  // Update countdown to 5h reset
  useEffect(() => {
    if (!data?.window_5h_reset_at) return;

    const timer = setInterval(() => {
      const diff = new Date(data.window_5h_reset_at).getTime() - Date.now();
      if (diff <= 0) {
        setCountdown("Resetting...");
        loadData();
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(`${hours}h ${mins}m ${secs}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [data?.window_5h_reset_at]);

  const copyUrl = () => {
    navigator.clipboard.writeText("https://api.gravixhost.app/v1");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
          <div className="h-4 w-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          Connecting to Gravix Edge Database...
        </div>
      </div>
    );
  }

  const spent5h = data?.spent_5h_cents || 0;
  const limit5h = data?.limit_5h_cents || 50;
  const percent5h = Math.min(100, Math.round((spent5h / limit5h) * 100));

  const spentWeek = data?.spent_week_cents || 0;
  const limitWeek = data?.limit_week_cents || 200;
  const percentWeek = Math.min(100, Math.round((spentWeek / limitWeek) * 100));

  const activeKeysCount = (data?.keys || []).filter((k: any) => k.is_active).length;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Console Overview
            </h1>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              {data?.email || "developer@gravixhost.app"}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Edge router status, live window limits, and instant endpoints.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Plan: {data?.plan_name || "Free Starter"}
          </span>
          <Link
            href="/dashboard/keys"
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            New API Key
          </Link>
        </div>
      </div>

      {/* Quotas & Rolling Limit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 5-Hour Rolling Limit */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  5-Hour Window Limit
                </h3>
                <p className="text-[11px] font-mono text-zinc-400">
                  Resets in: <span className="text-indigo-400 font-semibold">{countdown || "5h 00m"}</span>
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-white">
              ₹{(spent5h / 100).toFixed(2)} / ₹{(limit5h / 100).toFixed(2)}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${percent5h}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>{percent5h}% utilized</span>
              <span>₹{((limit5h - spent5h) / 100).toFixed(2)} remaining</span>
            </div>
          </div>
        </div>

        {/* 7-Day Weekly Cap */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Activity className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Weekly Rolling Cap
                </h3>
                <p className="text-[11px] font-mono text-zinc-400">7-Day Allocation</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-white">
              ₹{(spentWeek / 100).toFixed(2)} / ₹{(limitWeek / 100).toFixed(2)}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${percentWeek}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>{percentWeek}% utilized</span>
              <span>₹{((limitWeek - spentWeek) / 100).toFixed(2)} remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gateway Connection Details */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Edge Base URL
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            Active Keys: {activeKeysCount}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-3.5 space-y-2">
            <span className="text-[11px] font-medium text-zinc-400">
              OpenAI / Cursor Base URL
            </span>
            <div className="flex items-center justify-between font-mono text-xs text-indigo-300 bg-black/40 px-3 py-2 rounded-lg border border-zinc-800">
              <span>https://api.gravixhost.app/v1</span>
              <button
                onClick={copyUrl}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-3.5 space-y-2">
            <span className="text-[11px] font-medium text-zinc-400">
              Anthropic / Claude Code CLI Base URL
            </span>
            <div className="flex items-center justify-between font-mono text-xs text-purple-300 bg-black/40 px-3 py-2 rounded-lg border border-zinc-800">
              <span>https://api.gravixhost.app/v1</span>
              <button
                onClick={copyUrl}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quickstart snippet */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-zinc-400" />
            1-Line Claude Code CLI Quickstart
          </h3>
          <Link href="/docs" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
            All Guides <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 font-mono text-xs text-emerald-400 overflow-x-auto">
          <code>{`export ANTHROPIC_BASE_URL="https://api.gravixhost.app/v1" && export ANTHROPIC_API_KEY="grx_live_••••••••" && claude`}</code>
        </div>
      </div>
    </div>
  );
}
