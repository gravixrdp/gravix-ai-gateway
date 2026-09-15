"use client";

import { useState } from "react";
import { KeyRound, Plus, Copy, Check, Trash2, ShieldAlert } from "lucide-react";

interface KeyItem {
  id: string;
  name: string;
  suffix: string;
  created: string;
  lastUsed: string;
  status: "active" | "revoked";
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<KeyItem[]>([
    {
      id: "1",
      name: "Claude Code CLI Production",
      suffix: "7f8a",
      created: "2026-09-15",
      lastUsed: "Just now",
      status: "active",
    },
    {
      id: "2",
      name: "Cursor IDE Dev",
      suffix: "b3ed",
      created: "2026-09-14",
      lastUsed: "2 hours ago",
      status: "active",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const newRawKey = `grx_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    setGeneratedKey(newRawKey);
    setKeys([
      {
        id: Date.now().toString(),
        name: keyName || "Default Key",
        suffix: randomSuffix,
        created: new Date().toISOString().split("T")[0],
        lastUsed: "Never",
        status: "active",
      },
      ...keys,
    ]);
  };

  const handleCopy = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRevoke = (id: string) => {
    setKeys(keys.map((k) => (k.id === id ? { ...k, status: "revoked" } : k)));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            API Keys Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, monitor, and revoke API keys for your applications and CLI tools.
          </p>
        </div>
        <button
          onClick={() => {
            setKeyName("");
            setGeneratedKey(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition-all"
        >
          <Plus className="h-4 w-4" />
          Create New Secret Key
        </button>
      </div>

      {/* Keys Table Card */}
      <div className="rounded-3xl border border-white/10 bg-[#0F111C] overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-indigo-400" />
            Active Keys ({keys.filter((k) => k.status === "active").length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#08090E] text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Key Suffix</th>
                <th className="px-6 py-3.5">Created</th>
                <th className="px-6 py-3.5">Last Used</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {keys.map((k) => (
                <tr key={k.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{k.name}</td>
                  <td className="px-6 py-4 font-mono text-indigo-400">
                    grx_live_•••••••{k.suffix}
                  </td>
                  <td className="px-6 py-4 text-slate-400">{k.created}</td>
                  <td className="px-6 py-4 text-slate-400">{k.lastUsed}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        k.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {k.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {k.status === "active" && (
                      <button
                        onClick={() => handleRevoke(k.id)}
                        className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Revoke Key"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Key Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0F111C] p-6 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-white">Create New Secret Key</h3>

            {!generatedKey ? (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Key Identifier Name
                  </label>
                  <input
                    type="text"
                    required
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    placeholder="e.g. My Claude Code CLI"
                    className="w-full rounded-xl border border-white/10 bg-[#08090E] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                  >
                    Generate Key
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 flex gap-2 text-xs text-amber-300">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    Save this key securely now. For security reasons, you won&apos;t be able to see it again!
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-[#08090E] border border-white/10 p-3 font-mono text-xs text-emerald-400 break-all">
                  <span>{generatedKey}</span>
                  <button
                    onClick={handleCopy}
                    className="ml-2 p-1.5 rounded-lg bg-white/10 text-slate-200 hover:text-white shrink-0"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500"
                >
                  I have saved my key
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
