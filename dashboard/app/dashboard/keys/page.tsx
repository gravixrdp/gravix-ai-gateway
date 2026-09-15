"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Trash2,
  ShieldAlert,
  Download,
} from "lucide-react";

interface KeyItem {
  id: string;
  name: string;
  suffix: string;
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
  total_tokens: number;
}

// Compute SHA-256 in browser via Web Crypto
async function hashKey(rawKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(rawKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function ApiKeysPage() {
  const router = useRouter();
  const [keys, setKeys] = useState<KeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [generatedRawKey, setGeneratedRawKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);

  const loadKeys = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setKeys(
        (data || []).map((k: any) => ({
          id: k.id,
          name: k.name,
          suffix: k.key_suffix,
          created_at: new Date(k.created_at).toLocaleDateString(),
          last_used_at: k.last_used_at
            ? new Date(k.last_used_at).toLocaleTimeString()
            : "Never",
          is_active: k.is_active,
          total_tokens: k.total_tokens || 0,
        }))
      );
    } catch (err) {
      console.error("Error loading keys:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      // 1. Generate 32-byte secure random string
      const randomBytes = new Uint8Array(24);
      crypto.getRandomValues(randomBytes);
      const randomHex = Array.from(randomBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const rawKey = `grx_live_${randomHex}`;
      const suffix = rawKey.slice(-4);

      // 2. Hash key with SHA-256
      const keyHash = await hashKey(rawKey);

      // 3. Save to Supabase
      const { data, error } = await supabase.rpc("create_user_api_key", {
        p_name: keyName.trim() || "Default Key",
        p_key_hash: keyHash,
        p_key_suffix: suffix,
      });

      if (error) throw error;

      setGeneratedRawKey(rawKey);
      await loadKeys();
    } catch (err: any) {
      alert(err.message || "Failed to create key");
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = () => {
    if (generatedRawKey) {
      navigator.clipboard.writeText(generatedRawKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this secret key? Any service using it will immediately stop working.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("api_keys")
        .update({ is_active: false })
        .eq("id", id);
      if (error) throw error;
      setKeys(keys.map((k) => (k.id === id ? { ...k, is_active: false } : k)));
    } catch (err: any) {
      alert("Error revoking key: " + err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            API Keys
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Keys are hashed via SHA-256. Secret values are shown only once upon generation.
          </p>
        </div>
        <button
          onClick={() => {
            setKeyName("");
            setGeneratedRawKey(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Create New Secret Key
        </button>
      </div>

      {/* Keys Table / Empty State */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-500">
            Fetching active keys from edge vault...
          </div>
        ) : keys.length === 0 ? (
          <div className="p-14 text-center space-y-4">
            <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">No API Keys Found</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                You haven&apos;t created any secret keys yet. Generate your first key to connect Claude Code, Cursor, or your SDK.
              </p>
            </div>
            <button
              onClick={() => {
                setKeyName("");
                setGeneratedRawKey(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Generate Your First Key
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900/50 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-5 py-3">Key Label</th>
                  <th className="px-5 py-3">Masked Suffix</th>
                  <th className="px-5 py-3">Created Date</th>
                  <th className="px-5 py-3">Last Invocated</th>
                  <th className="px-5 py-3">Total Tokens</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Revoke</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {keys.map((k) => (
                  <tr key={k.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-5 py-3.5 font-sans font-medium text-white">
                      {k.name}
                    </td>
                    <td className="px-5 py-3.5 text-indigo-400">
                      grx_live_•••••••{k.suffix}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400">{k.created_at}</td>
                    <td className="px-5 py-3.5 text-zinc-400">{k.last_used_at}</td>
                    <td className="px-5 py-3.5 text-zinc-300">
                      {k.total_tokens.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          k.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {k.is_active ? "ACTIVE" : "REVOKED"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {k.is_active && (
                        <button
                          onClick={() => handleRevoke(k.id)}
                          className="text-zinc-500 hover:text-red-400 p-1 rounded transition-colors"
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
        )}
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-5">
            <h3 className="text-base font-bold text-white">
              Create Secret Key
            </h3>

            {!generatedRawKey ? (
              <form onSubmit={handleGenerateKey} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Key Identifier Name
                  </label>
                  <input
                    type="text"
                    required
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    placeholder="e.g. Claude Code CLI (Production)"
                    className="w-full rounded-xl border border-zinc-800 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none font-sans"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                  >
                    {creating ? "Generating..." : "Generate Secret"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 flex gap-2.5 text-xs text-amber-300">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Please copy this secret key now. For your security, you will not be able to view it again.
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-black border border-zinc-800 p-3 font-mono text-xs text-emerald-400 break-all select-all">
                  <span>{generatedRawKey}</span>
                  <button
                    onClick={handleCopy}
                    className="ml-2 p-1.5 rounded-lg bg-zinc-800 text-zinc-200 hover:text-white shrink-0"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500"
                >
                  I have saved my secret key
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
