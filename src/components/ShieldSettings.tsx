"use client";

import React, { useState } from "react";
import { UserProfile, AuthUser } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  RotateCcw,
  Database,
  CheckCircle2,
  AlertCircle,
  Brain,
  Sparkles,
  BookOpen,
  HelpCircle,
  Layers,
  ArrowRight,
  LogOut,
  User,
} from "lucide-react";

interface ShieldSettingsProps {
  profile: UserProfile;
  currentUser: AuthUser | null;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onRetakeAssessment: () => void;
  onResetData: (type: "fresh" | "demo") => void;
  onLockApp: () => void;
  onSignOut: () => void;
}

export const ShieldSettings: React.FC<ShieldSettingsProps> = ({
  profile,
  currentUser,
  onUpdateProfile,
  onRetakeAssessment,
  onResetData,
  onLockApp,
  onSignOut,
}) => {
  const [pinInput, setPinInput] = useState(profile.pinCode || "");
  const [isEditingPin, setIsEditingPin] = useState(false);
  const [pinSavedMsg, setPinSavedMsg] = useState(false);
  const [showScienceModal, setShowScienceModal] = useState(false);
  const [confirmFreshModal, setConfirmFreshModal] = useState(false);

  const handleSavePin = () => {
    if (pinInput.length === 4 && /^\d+$/.test(pinInput)) {
      onUpdateProfile({ pinCode: pinInput });
      setIsEditingPin(false);
      setPinSavedMsg(true);
      setTimeout(() => setPinSavedMsg(false), 2500);
    }
  };

  const handleRemovePin = () => {
    onUpdateProfile({ pinCode: null });
    setPinInput("");
    setIsEditingPin(false);
  };

  const handleToggleDisguise = () => {
    onUpdateProfile({ disguiseTitle: !profile.disguiseTitle });
  };

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Top Header */}
      <div className="px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          Shield & Privacy Engine
        </span>
        <h1 className="text-xl font-black text-white tracking-tight mt-0.5">
          Discreet Security & Controls
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Protect your recovery privacy with PIN lock, app title disguise, and data sync.
        </p>
      </div>

      {/* ======================================================== */}
      {/* 0. ACTIVE USER ACCOUNT & SESSION                         */}
      {/* ======================================================== */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Active User Account
              </span>
              <p className="text-[11px] text-slate-400">
                {currentUser?.email || "Local Disciple Account"}
              </p>
            </div>
          </div>

          <button
            onClick={onSignOut}
            className="px-3 py-1.5 rounded-xl bg-rose-950/30 hover:bg-rose-950/50 text-rose-300 text-xs font-bold border border-rose-800/40 flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Disciple Name</span>
            <span className="font-bold text-white text-sm">{profile.displayName || currentUser?.displayName}</span>
          </div>

          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Data Privacy</span>
            <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1 justify-end">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Isolated
            </span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 leading-relaxed">
          Your recovery streak, psychometrics, and journal notes are strictly tied to your account ID ({profile.id}).
        </p>
      </div>

      {/* ======================================================== */}
      {/* 1. DISCREET PRIVACY PIN LOCK                             */}
      {/* ======================================================== */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                4-Digit Privacy PIN Lock
              </span>
              <p className="text-[11px] text-slate-400">
                {profile.pinCode ? "Lock screen is active" : "Protect app from curious eyes"}
              </p>
            </div>
          </div>

          {profile.pinCode && (
            <button
              onClick={onLockApp}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-emerald-400 font-semibold border border-slate-700 transition-all"
            >
              Lock Now
            </button>
          )}
        </div>

        {profile.pinCode && !isEditingPin ? (
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>PIN enabled: ****</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditingPin(true)}
                className="text-xs text-emerald-400 font-semibold hover:underline"
              >
                Change
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={handleRemovePin}
                className="text-xs text-rose-400 font-semibold hover:underline"
              >
                Disable
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            <div className="flex gap-2">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 4-digit PIN"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-center text-white tracking-widest focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSavePin}
                disabled={pinInput.length !== 4}
                className="px-4 py-2 rounded-xl bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
              >
                Save PIN
              </button>
              {isEditingPin && (
                <button
                  onClick={() => setIsEditingPin(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {pinSavedMsg && (
          <p className="text-[11px] text-emerald-400 font-semibold">
            ✓ PIN lock successfully activated!
          </p>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. APP DISGUISE TOGGLE                                  */}
      {/* ======================================================== */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              {profile.disguiseTitle ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Disguise Header as "Daily Habits"
              </span>
              <p className="text-[11px] text-slate-400">
                Hides recovery wording on the lock and header bar
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={handleToggleDisguise}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              profile.disguiseTitle ? "bg-emerald-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                profile.disguiseTitle ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 text-[11px] text-slate-400 leading-relaxed border border-slate-800/80">
          When enabled, the app title displays as <strong className="text-white">"Daily Habits"</strong> so friends or family glancing over your shoulder will not see addiction recovery branding.
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. DUAL-MODE SUPABASE & LOCALSTORAGE STATUS             */}
      {/* ======================================================== */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Dual-Mode Zero-Cost Engine
              </span>
              <p className="text-[11px] text-slate-400">Zero database bill guarantee</p>
            </div>
          </div>

          {isSupabaseConfigured ? (
            <span className="text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Supabase Synced
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Layers className="w-3 h-3" /> LocalStorage Active
            </span>
          )}
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {isSupabaseConfigured
            ? "Your account is actively syncing with your private free-tier Supabase PostgreSQL database."
            : "The app is running offline in zero-configuration LocalStorage mode. Your data is 100% private to your device. To sync across devices, add free NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables to Vercel."}
        </p>
      </div>

      {/* ======================================================== */}
      {/* 4. SCIENTIFIC ASSESSMENT RETAKE                         */}
      {/* ======================================================== */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Scientific Diagnostic Baseline
            </span>
            <p className="text-[11px] text-slate-400">
              Current: {profile.addictionTier} ({profile.onboardingScore}/32 pts)
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Take the 8-question CPUI-9 assessment again after 30 days to measure your prefrontal recovery and re-calibrate your baseline score.
        </p>

        <button
          onClick={onRetakeAssessment}
          className="w-full py-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Baseline Assessment</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 5. DATA RESET & DEMO CONTROLS                           */}
      {/* ======================================================== */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Recovery Journey Data Controls
        </span>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onResetData("demo")}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all text-center"
          >
            Load Realistic Demo Data
          </button>

          <button
            onClick={() => setConfirmFreshModal(true)}
            className="p-3 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 font-semibold text-xs border border-rose-900/40 transition-all text-center"
          >
            Start Fresh Clean Slate
          </button>
        </div>
      </div>

      {/* Science & Theology Guide Link */}
      <button
        onClick={() => setShowScienceModal(true)}
        className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300 hover:border-emerald-500/40 transition-all"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">The Behavioral Neuroscience of Lust (Methodology)</span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-500" />
      </button>

      {/* ======================================================== */}
      {/* CONFIRM FRESH SLATE MODAL                               */}
      {/* ======================================================== */}
      {confirmFreshModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0D1322] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Start Fresh Clean Slate?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This will clear all logs and launch the 8-question Scientific Assessment so you can configure your own personal baseline.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmFreshModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmFreshModal(false);
                  onResetData("fresh");
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider"
              >
                Yes, Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCIENCE & METHODOLOGY MODAL                             */}
      {/* ======================================================== */}
      {showScienceModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#0D1322] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Brain className="w-4 h-4" />
                Unbroken Methodology
              </span>
              <button
                onClick={() => setShowScienceModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <h2 className="text-lg font-bold text-white">How Unbroken Rewires the Brain</h2>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-emerald-400">1. Delta-FosB & Synaptic Pruning:</strong> Every time pornography is viewed, the transcription factor Delta-FosB accumulates in the nucleus accumbens, reinforcing addictive loops. By staying clean, these pathways undergo biological synaptic pruning.
              </p>
              <p>
                <strong className="text-amber-400">2. The Prefrontal Brake:</strong> Teenagers have a rapidly developing prefrontal cortex (the impulse brake). Lust hijacks this by stimulating the ventral tegmental area. Speaking Scripture aloud actively activates the left prefrontal cortex, dampening the amygdala.
              </p>
              <p>
                <strong className="text-cyan-400">3. Spiritual Sanctification:</strong> Romans 12:2 calls for the "renewing of your mind." This is not just poetic theology—it is biological truth. God designed neuroplasticity so that your mind can be transformed into Christlikeness.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
