"use client";

import React, { useState } from "react";
import { AuthUser } from "@/types";
import {
  authenticateUser,
  registerNewUser,
  loginAsDemoGuest,
} from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  Shield,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Database,
  Layers,
  Flame,
} from "lucide-react";

interface LoginPageProps {
  onAuthSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const res = await authenticateUser(email, password);
        if (res.success && res.user) {
          onAuthSuccess(res.user);
        } else {
          setErrorMessage(res.error || "Authentication failed. Please check your credentials.");
        }
      } else {
        const res = await registerNewUser(email, password, displayName);
        if (res.success && res.user) {
          onAuthSuccess(res.user);
        } else {
          setErrorMessage(res.error || "Failed to create account. Please try again.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    const demoUser = loginAsDemoGuest();
    onAuthSuccess(demoUser);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col justify-between p-5 max-w-md mx-auto">
      {/* Top Branding */}
      <div className="pt-8 flex flex-col items-center text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-xl shadow-emerald-500/20 border-2 border-emerald-400/40 animate-pulse-glow">
          <Shield className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">UNBROKEN</h1>
          <p className="text-xs font-semibold tracking-wider text-emerald-400 uppercase mt-0.5">
            Clear Eyes, Clean Mind.
          </p>
        </div>

        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          "For a righteous man may fall seven times and rise again, but the wicked shall fall by calamity." — Proverbs 24:16
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="my-6 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-5">
        {/* Tab Switcher */}
        <div className="flex bg-slate-950 border border-slate-800 rounded-2xl p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              mode === "login"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              mode === "signup"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-fade-in">
            <span className="shrink-0 text-base">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Your Name or Disciple Alias
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Caleb, Nathaniel, Joshua"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 mt-2"
          >
            {loading ? (
              <span>Connecting Securely...</span>
            ) : mode === "login" ? (
              <>
                <span>Sign In to My Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Create Account & Start Baseline</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-1">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
            Or Quick Access
          </span>
          <div className="border-t border-slate-800 w-full" />
        </div>

        {/* Quick Demo Account Button */}
        <button
          type="button"
          onClick={handleQuickDemo}
          className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5 text-left">
            <span className="text-base">👤</span>
            <div>
              <span className="font-bold text-white block">Preview Demo Account (Nathaniel)</span>
              <span className="text-[10px] text-slate-400">Preloaded 14-day streak with rich charts</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
        </button>

        {/* Data Isolation Guarantee */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[10px] text-slate-400 leading-relaxed space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[9px]">
            <CheckCircle2 className="w-3 h-3" />
            100% Isolated & Private Data
          </div>
          <p>
            Every user's streak counter, daily logs, HALT triggers, and saved Scriptures are stored under their own unique account. Multiple users can log in on the same device without seeing each other's data.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pb-4 text-center text-[10px] text-slate-500 flex items-center justify-center gap-2">
        {isSupabaseConfigured ? (
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <Database className="w-3 h-3" /> Supabase Cloud Auth Active
          </span>
        ) : (
          <span className="flex items-center gap-1 text-slate-400">
            <Layers className="w-3 h-3" /> Offline Multi-User Storage Active
          </span>
        )}
      </div>
    </div>
  );
};
