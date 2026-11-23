"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Users,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Lock,
  ArrowRight,
  LogOut,
  AlertCircle,
  FileCheck2,
} from "lucide-react";

interface AdminStats {
  totalGenerations: number;
  todayGenerations: number;
  totalUnlocks: number;
  todayUnlocks: number;
  estimatedRevenue: number;
  todayRevenue: number;
  activeProPasses: number;
  uniqueVisitors: number;
  recentTransactions: Array<{
    id: string;
    utr: string;
    timestamp: number;
    ip: string;
    amount: number;
    status: "verified" | "flagged";
  }>;
  recentActivity: Array<{
    id: string;
    timestamp: number;
    type: "free_preview" | "pro_generation" | "pro_unlock";
    ip: string;
    utr?: string;
  }>;
}

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [authenticatedPin, setAuthenticatedPin] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Check saved session PIN on mount
  useEffect(() => {
    const savedPin = sessionStorage.getItem("rr_admin_pin");
    if (savedPin) {
      setAuthenticatedPin(savedPin);
      fetchStats(savedPin);
    }
  }, []);

  const fetchStats = async (authPin: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/stats?pin=${encodeURIComponent(authPin)}`, {
        headers: { "x-admin-pin": authPin },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load admin stats");
      }
      setStats(data.data);
      sessionStorage.setItem("rr_admin_pin", authPin);
      setAuthenticatedPin(authPin);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
      if (e.message.toLowerCase().includes("unauthorized")) {
        setAuthenticatedPin(null);
        sessionStorage.removeItem("rr_admin_pin");
      }
    } finally {
      setLoading(false);
    }
  };

  // Periodic auto-refresh every 15 seconds
  useEffect(() => {
    if (!authenticatedPin || !autoRefresh) return;
    const interval = setInterval(() => {
      fetchStats(authenticatedPin);
    }, 15000);
    return () => clearInterval(interval);
  }, [authenticatedPin, autoRefresh]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;
    fetchStats(pin.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem("rr_admin_pin");
    setAuthenticatedPin(null);
    setStats(null);
    setPin("");
  };

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "numeric",
      month: "short",
    });
  };

  // ==========================================
  // PASSCODE LOCK SCREEN
  // ==========================================
  if (!authenticatedPin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-brand-500 selection:text-white">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">ReadyResume Admin</h1>
              <p className="text-xs text-slate-400">Owner Portal & Analytics</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Enter Admin Passcode
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter secret 6-digit PIN"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 transition-colors text-center text-lg tracking-widest"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !pin}
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  Access Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Protected area. Authorized administrators only.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20">
              RR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">ReadyResume</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  ADMIN PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Live Production Monitoring</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>UPI Payments: 7599970805@fam</span>
            </div>

            <button
              onClick={() => fetchStats(authenticatedPin)}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Banner Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
          <div>
            <h2 className="text-xl font-bold text-white">Live Business Overview</h2>
            <p className="text-xs text-slate-400 mt-1">
              Real-time generation counter, 12-digit UPI UTR audits, and live visitor telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                autoRefresh
                  ? "bg-brand-500/20 border-brand-500/40 text-brand-300"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-brand-400" : "bg-slate-500"}`} />
              <span>Auto-refresh (15s)</span>
            </button>

            <a
              href="https://vercel.com/vanshgautam107-6492/readyresume/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Vercel Web Analytics</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 4 Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Revenue */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Estimated Revenue</span>
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">
              ₹{(stats?.estimatedRevenue || 0).toLocaleString("en-IN")}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+₹{(stats?.todayRevenue || 0).toLocaleString("en-IN")} today</span>
            </div>
          </div>

          {/* Card 2: Total Generations */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Total Generations</span>
              <div className="p-2 rounded-lg bg-brand-500/20 text-brand-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">
              {(stats?.totalGenerations || 0).toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
              <span>{stats?.todayGenerations || 0} completed today</span>
            </div>
          </div>

          {/* Card 3: Pro Passes */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">10-Day Pro Passes</span>
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">
              {stats?.activeProPasses || 0}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
              <span>{stats?.totalUnlocks || 0} all-time unlocked passes</span>
            </div>
          </div>

          {/* Card 4: Unique Visitors */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Unique Client IPs</span>
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">
              {stats?.uniqueVisitors || 0}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-purple-400">
              <span>Active in current server window</span>
            </div>
          </div>
        </div>

        {/* Detailed 2-Column Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Table: UPI Payment & UTR Audit Log */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  Recent UPI Unlocks (12-Digit UTRs)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cross-verify these UTRs with your FamPay / bank SMS alerts.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                {stats?.recentTransactions?.length || 0} recorded
              </span>
            </div>

            <div className="flex-1 overflow-x-auto">
              {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="py-2.5">Time</th>
                      <th className="py-2.5">12-Digit UTR</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {stats.recentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 text-slate-400 whitespace-nowrap">
                          {formatTimestamp(tx.timestamp)}
                        </td>
                        <td className="py-3 font-mono font-bold text-white tracking-wider">
                          {tx.utr}
                        </td>
                        <td className="py-3 font-bold text-emerald-400">₹{tx.amount}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            VERIFIED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl text-slate-400">
                  <FileCheck2 className="w-8 h-8 text-slate-600 mb-2" />
                  <p className="text-sm font-medium text-slate-300">No UTRs submitted yet</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    When visitors pay ₹49 and submit their 12-digit transaction UTR, it will instantly appear in this table.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Table: Recent Generation Activity Log */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  Recent Generation Activity
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live stream of resume optimizations and interview kit generations.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-950/60 text-brand-400 border border-brand-800/40">
                {stats?.recentActivity?.length || 0} events
              </span>
            </div>

            <div className="flex-1 overflow-x-auto">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="py-2.5">Time</th>
                      <th className="py-2.5">Type</th>
                      <th className="py-2.5">Client IP</th>
                      <th className="py-2.5">Pass Info</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {stats.recentActivity.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 text-slate-400 whitespace-nowrap">
                          {formatTimestamp(act.timestamp)}
                        </td>
                        <td className="py-3">
                          {act.type === "pro_generation" ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              PRO (10/DAY)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              FREE PREVIEW
                            </span>
                          )}
                        </td>
                        <td className="py-3 font-mono text-slate-400">{act.ip}</td>
                        <td className="py-3 text-slate-400 font-mono text-[11px]">
                          {act.utr ? `UTR: ${act.utr}` : "Standard IP"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl text-slate-400">
                  <Sparkles className="w-8 h-8 text-slate-600 mb-2" />
                  <p className="text-sm font-medium text-slate-300">No generations recorded yet</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Each time a user runs an ATS analysis or unlocks a resume, the event logs here in real time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>
            ⚡ Powered by Groq Cloud (`openai/gpt-oss-120b`) • Next.js 15.5.29 • Vercel Edge CDN
          </span>
          <span>🔒 Private Admin Session Active</span>
        </div>
      </main>
    </div>
  );
}
