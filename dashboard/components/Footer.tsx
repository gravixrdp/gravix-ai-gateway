import Link from "next/link";
import { Zap, ShieldCheck, Github, MessageSquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#07080B] text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
                <Zap className="h-4 w-4 text-white fill-white" />
              </div>
              <span className="font-bold text-base text-white">GravixAI Gateway</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The high-performance API gateway engineered for autonomous AI agents, Claude Code CLI, Cursor, and enterprise LLM workflows.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              All Upstream Systems Operational (&lt;5ms edge)
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#models" className="hover:text-white transition-colors">Model Catalog</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">Edge Proxy Routing</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing & Windows</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Claude Code Setup</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Developers
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/docs" className="hover:text-white transition-colors">API Reference</Link></li>
              <li><Link href="/docs#cursor" className="hover:text-white transition-colors">Cursor IDE Guide</Link></li>
              <li><Link href="/docs#python" className="hover:text-white transition-colors">OpenAI & Anthropic SDKs</Link></li>
              <li><Link href="/docs#limits" className="hover:text-white transition-colors">5-Hour Rate Limits</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Community & Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://t.me/gravixhost" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Telegram Developer Hub
                </a>
              </li>
              <li>
                <a href="https://github.com/gravixrdp/gravix-ai-gateway" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Github className="h-3.5 w-3.5" />
                  GitHub Repository
                </a>
              </li>
              <li className="text-xs text-slate-500 pt-2">
                gravixrdp@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GravixAI (`gravixhost.app`). All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/pricing" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="/pricing" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/pricing" className="hover:text-slate-400">Security SLA</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
