"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ListFilter, ShieldCheck, Terminal, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function LogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("usage_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Request Logs & Telemetry
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time audit log of all API invocations dispatched through Gravix Edge Router.
          </p>
        </div>
        <button
          onClick={loadLogs}
          className="text-xs font-mono text-indigo-400 hover:text-indigo-300 border border-zinc-800 bg-zinc-900 px-3 py-1.5 rounded-lg transition-colors"
        >
          ↻ Refresh Logs
        </button>
      </div>

      {/* Table / Empty State */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-500">
            Streaming logs from edge proxy...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-14 text-center space-y-4">
            <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
              <ListFilter className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">No Request Logs Recorded</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                Your keys haven&apos;t received any API traffic yet. Run a curl request or use Claude Code CLI to see telemetry here.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/docs"
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 border border-zinc-700 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
              >
                <Terminal className="h-3.5 w-3.5" />
                View 1-Line Test Command
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300 font-mono">
              <thead className="bg-zinc-900/50 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 font-sans">
                <tr>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3">Model</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Prompt / Comp Tokens</th>
                  <th className="px-5 py-3">Total Cost</th>
                  <th className="px-5 py-3">Edge Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-5 py-3.5 text-zinc-400">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </td>
                    <td className="px-5 py-3.5 font-sans font-medium text-white">
                      {log.model}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status_code === 200
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {log.status_code}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-300">
                      {log.prompt_tokens} / {log.completion_tokens}
                    </td>
                    <td className="px-5 py-3.5 text-emerald-400 font-semibold">
                      ₹{(log.cost_cents / 100).toFixed(4)}
                    </td>
                    <td className="px-5 py-3.5 text-indigo-400 font-mono">
                      {log.latency_ms}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
