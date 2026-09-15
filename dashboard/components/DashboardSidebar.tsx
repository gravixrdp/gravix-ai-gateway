"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Zap,
  LayoutDashboard,
  KeyRound,
  BarChart3,
  ListFilter,
  CreditCard,
  BookOpen,
  LogOut,
} from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "API Keys", href: "/dashboard/keys", icon: KeyRound },
    { label: "Usage & Limits", href: "/dashboard/usage", icon: BarChart3 },
    { label: "Request Logs", href: "/dashboard/logs", icon: ListFilter },
    { label: "Billing & Plans", href: "/dashboard/billing", icon: CreditCard },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!mounted) {
    return (
      <aside className="w-64 border-r border-zinc-800 bg-[#0A0C14] flex flex-col justify-between p-4 min-h-screen shrink-0 font-sans" />
    );
  }

  return (
    <aside className="w-64 border-r border-zinc-800 bg-[#0A0C14] flex flex-col justify-between p-4 min-h-screen shrink-0 font-sans">
      <div className="space-y-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-md">
            <Zap className="h-4 w-4 text-white fill-white" />
          </div>
          <span className="font-bold text-base text-white">GravixAI Edge</span>
        </Link>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area */}
      <div className="border-t border-zinc-800 pt-4 space-y-1">
        <Link
          href="/docs"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all"
        >
          <BookOpen className="h-4 w-4" />
          Docs & Integration
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
