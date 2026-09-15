"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BarChart3, Clock, Zap, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function UsagePage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsage = async () => {
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
        console.error("Failed to load usage:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsage();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-xs font-mono text-zinc-500">
          Fetching live token telemetry...
        </div>
      </div>
    );
  }

  const spent5h = data?.spent_5h_cents || 0;
  const limit5h = data?.limit_5h_cents || 50;
  const spentWeek = data?.spent_week_cents || 0;
  const limitWeek = data?.limit_week_cents || 200;

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Usage & Analytics
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time breakdown of rolling window consumption and model token allocations.
          </p>
        </div>
        <Link
          href="/pricing"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors"
        >
          Upgrade Quota <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-400" />
              5-Hour Rolling Limit
            </h3>
            <span className="text-xs font-mono font-bold text-white">
              ₹{(spent5h / 100).toFixed(2)} / ₹{(limit5h / 100).toFixed(2)}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${Math.min(100, (spent5h / limit5h) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-zinc-400">
            Window refreshes continuously. Unused quota rolls forward without penalty.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              7-Day Allocation
            </h3>
            <span className="text-xs font-mono font-bold text-white">
              ₹{(spentWeek / 100).toFixed(2)} / ₹{(limitWeek / 100).toFixed(2)}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${Math.min(100, (spentWeek / limitWeek) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-zinc-400">
            Weekly maximum spend ceiling. Upgrade plan for unlimited scaling.
          </p>
        </div>
      </div>
    </div>
  );
}
