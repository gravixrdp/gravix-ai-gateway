"use client";

import { ListFilter, ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";

export default function LogsPage() {
  const logs = [
    {
      id: "req_8f1a",
      timestamp: "14:28:10",
      model: "claude-3-7-sonnet",
      status: 200,
      latency: "342ms",
      promptTokens: 1840,
      completionTokens: 620,
      endpoint: "/v1/messages",
    },
    {
      id: "req_7e2b",
      timestamp: "14:26:05",
      model: "claude-3-7-sonnet",
      status: 200,
      latency: "410ms",
      promptTokens: 4200,
      completionTokens: 890,
      endpoint: "/v1/messages",
    },
    {
      id: "req_6d3c",
      timestamp: "14:22:40",
      model: "deepseek-r1",
      status: 200,
      latency: "520ms",
      promptTokens: 3100,
      completionTokens: 1240,
      endpoint: "/v1/chat/completions",
    },
    {
      id: "req_5c4d",
      timestamp: "14:15:12",
      model: "gpt-4o",
      status: 200,
      latency: "280ms",
      promptTokens: 980,
      completionTokens: 310,
      endpoint: "/v1/chat/completions",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Request Logs & Trace
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Live stream of API invocations routed through the Gravix Edge gateway.
        </p>
      </div>

      {/* Logs Table Card */}
      <div className="rounded-3xl border border-white/10 bg-[#0F111C] overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ListFilter className="h-4 w-4 text-indigo-400" />
            Live Audit Stream
          </h3>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Connected to Edge
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#08090E] text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-3.5">Time</th>
                <th className="px-6 py-3.5">Request ID</th>
                <th className="px-6 py-3.5">Endpoint</th>
                <th className="px-6 py-3.5">Model</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Tokens</th>
                <th className="px-6 py-3.5">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-slate-400">{log.timestamp}</td>
                  <td className="px-6 py-4 text-indigo-400">{log.id}</td>
                  <td className="px-6 py-4 text-slate-300">{log.endpoint}</td>
                  <td className="px-6 py-4 text-white font-semibold">{log.model}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 200
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {log.status} OK
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {log.promptTokens + log.completionTokens} tokens
                  </td>
                  <td className="px-6 py-4 text-emerald-400">{log.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
