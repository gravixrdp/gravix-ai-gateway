"use client";

import { useState } from "react";
import { CreditCard, QrCode, Coins, Check, Zap, ArrowRight, ShieldCheck } from "lucide-react";

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro" | "max">("pro");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "crypto">("upi");
  const [utrNumber, setUtrNumber] = useState("");
  const [verified, setVerified] = useState(false);

  const plans = [
    {
      id: "starter" as const,
      name: "Dev Starter",
      priceINR: 499,
      priceUSD: 6,
      limit5h: "₹150 / 5h",
      limitWeek: "₹1,000 / week",
    },
    {
      id: "pro" as const,
      name: "Pro Developer",
      priceINR: 999,
      priceUSD: 12,
      limit5h: "₹500 / 5h",
      limitWeek: "₹3,500 / week",
      recommended: true,
    },
    {
      id: "max" as const,
      name: "Team Max",
      priceINR: 2499,
      priceUSD: 30,
      limit5h: "₹1,500 / 5h",
      limitWeek: "₹10,000 / week",
    },
  ];

  const currentPlan = plans.find((p) => p.id === selectedPlan)!;

  const handleVerifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setVerified(true);
    setTimeout(() => {
      setPaymentModalOpen(false);
      setVerified(false);
      setUtrNumber("");
    }, 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Billing & Subscription
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your subscription, rolling window allowances, and payment methods.
        </p>
      </div>

      {/* Plan Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedPlan(p.id)}
            className={`cursor-pointer rounded-3xl border p-6 flex flex-col justify-between transition-all ${
              selectedPlan === p.id
                ? "border-indigo-500 bg-[#121526] shadow-xl ring-2 ring-indigo-500/50"
                : "border-white/10 bg-[#0F111C] hover:border-white/20"
            }`}
          >
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                {p.recommended && (
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </div>

              <div className="mt-4">
                <span className="text-3xl font-extrabold font-mono text-white">₹{p.priceINR}</span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>

              <div className="mt-4 rounded-xl bg-white/5 p-3 space-y-1 text-xs font-mono">
                <div className="text-indigo-300 font-semibold">{p.limit5h} rolling limit</div>
                <div className="text-slate-400">{p.limitWeek} quota cap</div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedPlan(p.id);
                setPaymentModalOpen(true);
              }}
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-500 transition-all"
            >
              Subscribe with UPI / Crypto
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0F111C] p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Upgrade to {currentPlan.name}</h3>
                <p className="text-xs font-mono text-indigo-400">Total: ₹{currentPlan.priceINR} / month</p>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Payment Method Switcher */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPaymentMethod("upi")}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold border ${
                  paymentMethod === "upi"
                    ? "bg-indigo-600 text-white border-indigo-500"
                    : "bg-white/5 text-slate-400 border-white/5 hover:text-white"
                }`}
              >
                <QrCode className="h-4 w-4" />
                Instant UPI QR (INR)
              </button>
              <button
                onClick={() => setPaymentMethod("crypto")}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold border ${
                  paymentMethod === "crypto"
                    ? "bg-indigo-600 text-white border-indigo-500"
                    : "bg-white/5 text-slate-400 border-white/5 hover:text-white"
                }`}
              >
                <Coins className="h-4 w-4" />
                USDT Crypto (USD)
              </button>
            </div>

            {verified ? (
              <div className="text-center py-6 space-y-2">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-white">Payment Verified!</h4>
                <p className="text-xs text-slate-400">Your plan limits have been upgraded instantly.</p>
              </div>
            ) : paymentMethod === "upi" ? (
              <form onSubmit={handleVerifyPayment} className="space-y-4">
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="h-40 w-40 rounded-xl bg-white p-2 flex items-center justify-center shadow-lg">
                    {/* Simulated Dynamic UPI QR SVG */}
                    <svg viewBox="0 0 100 100" className="h-full w-full">
                      <rect width="100" height="100" fill="white" />
                      <rect x="10" y="10" width="30" height="30" fill="black" />
                      <rect x="15" y="15" width="20" height="20" fill="white" />
                      <rect x="20" y="20" width="10" height="10" fill="black" />
                      <rect x="60" y="10" width="30" height="30" fill="black" />
                      <rect x="65" y="15" width="20" height="20" fill="white" />
                      <rect x="70" y="20" width="10" height="10" fill="black" />
                      <rect x="10" y="60" width="30" height="30" fill="black" />
                      <rect x="15" y="65" width="20" height="20" fill="white" />
                      <rect x="20" y="70" width="10" height="10" fill="black" />
                      <rect x="45" y="45" width="10" height="10" fill="black" />
                      <rect x="60" y="60" width="15" height="15" fill="black" />
                      <rect x="80" y="75" width="10" height="15" fill="black" />
                    </svg>
                  </div>
                  <p className="mt-3 text-xs font-mono font-semibold text-indigo-300">
                    UPI ID: gravixhost@upi
                  </p>
                  <p className="text-[11px] text-slate-400">Scan via PhonePe / GPay / Paytm</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    12-digit UTR / Reference ID
                  </label>
                  <input
                    type="text"
                    required
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 425178942105"
                    className="w-full rounded-xl border border-white/10 bg-[#08090E] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow hover:bg-indigo-500"
                >
                  Verify & Activate Plan
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>USDT Network</span>
                    <span className="font-semibold text-emerald-400">TRC-20 (Tron)</span>
                  </div>
                  <div className="font-mono text-xs text-indigo-300 bg-black/40 p-2.5 rounded-lg break-all">
                    TQ9xP7k...[Oxapay_Instant_Deposit_Address]...7vX1
                  </div>
                </div>

                <button
                  onClick={() => {
                    setVerified(true);
                    setTimeout(() => setPaymentModalOpen(false), 2000);
                  }}
                  className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow hover:bg-indigo-500"
                >
                  I have transferred USDT
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
