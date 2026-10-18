"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, DailyLog, SavedVerse, Milestone } from "@/types";
import { BIBLICAL_MILESTONES } from "@/lib/constants";
import { getDailyVerse } from "@/data/nkjv-verses";
import { calculate30DayVictoryRate } from "@/lib/storage";
import {
  Flame,
  Shield,
  Heart,
  Share2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Trophy,
  ChevronRight,
  Info,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Zap,
} from "lucide-react";

interface HomeDashboardProps {
  profile: UserProfile;
  dailyLogs: DailyLog[];
  onOpenCheckIn: () => void;
  onOpenSOS: () => void;
  onSaveVerse: (ref: string, text: string) => void;
  isSavedVerse: (ref: string) => boolean;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  dailyLogs,
  onOpenCheckIn,
  onOpenSOS,
  onSaveVerse,
  isSavedVerse,
}) => {
  const [timeUnits, setTimeUnits] = useState({ days: 0, hours: 0, minutes: 0 });
  const [showMilestonesModal, setShowMilestonesModal] = useState(false);
  const [showMeditateModal, setShowMeditateModal] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const dailyVerse = getDailyVerse();
  const victoryRate = calculate30DayVictoryRate(dailyLogs);

  // Compute live streak time (Days, Hours, Minutes)
  useEffect(() => {
    const updateTime = () => {
      const start = new Date(profile.streakStartTimestamp).getTime();
      const now = Date.now();
      const diffMs = Math.max(now - start, 0);

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

      setTimeUnits({ days, hours, minutes });
    };

    updateTime();
    const timer = setInterval(updateTime, 30000); // refresh every 30s
    return () => clearInterval(timer);
  }, [profile.streakStartTimestamp]);

  // Current milestone rank
  const currentMilestone =
    [...BIBLICAL_MILESTONES]
      .reverse()
      .find((m) => timeUnits.days >= m.days) || BIBLICAL_MILESTONES[0];

  // Next milestone
  const nextMilestone =
    BIBLICAL_MILESTONES.find((m) => m.days > timeUnits.days) ||
    BIBLICAL_MILESTONES[BIBLICAL_MILESTONES.length - 1];

  // Milestone Progress Ring calculation
  const prevDays = currentMilestone.days === nextMilestone.days ? 0 : currentMilestone.days;
  const progressRatio =
    nextMilestone.days === prevDays
      ? 1
      : Math.min(Math.max((timeUnits.days - prevDays) / (nextMilestone.days - prevDays), 0.08), 1);

  const circumference = 2 * Math.PI * 72; // radius 72
  const strokeDashoffset = circumference - progressRatio * circumference;

  const handleShareVerse = () => {
    const shareText = `"${dailyVerse.text}" — ${dailyVerse.reference} (NKJV)\n\nClear Eyes, Clean Mind.\nWalking in freedom with Unbroken.`;
    if (navigator.share) {
      navigator.share({ title: dailyVerse.reference, text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-2">
      {/* Top Welcome Bar */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Walking in Grace
          </span>
          <h1 className="text-xl font-black text-white tracking-tight">
            Welcome back, {profile.displayName}
          </h1>
        </div>

        {/* Milestone Badge Pill */}
        <button
          onClick={() => setShowMilestonesModal(true)}
          className="px-3 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition-all shadow-sm"
        >
          <span>{currentMilestone.badge}</span>
          <span className="max-w-[100px] truncate">{currentMilestone.title}</span>
        </button>
      </div>

      {/* Official Slogan Banner Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-slate-900 to-teal-500/10 border border-emerald-500/30 flex items-center gap-3 shadow-md">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Clear Eyes, Clean Mind.
            </span>
          </div>
          <p className="text-[11px] font-serif italic text-slate-300 leading-snug mt-0.5">
            "For a righteous man may fall seven times and rise again..." — Proverbs 24:16
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ANIMATED CIRCULAR STREAK RING                           */}
      {/* ======================================================== */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 to-[#0B1120] border border-slate-800 shadow-xl relative overflow-hidden flex flex-col items-center">
        {/* Subtle background glow */}
        <div className="absolute top-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-48 h-48 flex items-center justify-center my-1">
          {/* SVG Progress Ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r="72"
              className="text-slate-800/80"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated Progress Gradient Ring */}
            <defs>
              <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="60%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
            <circle
              cx="80"
              cy="80"
              r="72"
              stroke="url(#ringGradient)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Central Counter */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Clean Streak</span>
            </div>
            <div className="text-4xl font-black text-white tracking-tight mt-0.5">
              {timeUnits.days}
              <span className="text-base font-bold text-slate-400 ml-0.5">d</span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              {timeUnits.hours}h {timeUnits.minutes}m clean
            </div>
          </div>
        </div>

        {/* Milestone Indicator Footer */}
        <div className="w-full mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">{currentMilestone.badge}</span>
            <div>
              <span className="font-bold text-white block">{currentMilestone.title}</span>
              <span className="text-[10px] text-slate-400">Next rank: {nextMilestone.title} ({nextMilestone.days}d)</span>
            </div>
          </div>
          <button
            onClick={() => setShowMilestonesModal(true)}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center"
          >
            All Ranks <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* THE "30-DAY VICTORY RATE" METRIC (CRUCIAL ANTI-DESPAIR)  */}
      {/* ======================================================== */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                30-Day Victory Rate
              </span>
              <p className="text-[11px] text-slate-400">Neurological consistency metric</p>
            </div>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-400">{victoryRate}%</span>
            <span className="text-[10px] text-slate-500 font-semibold">win rate</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${victoryRate}%` }}
          />
        </div>

        {/* Anti-Despair Reassurance Box */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-200">Anti-Despair Engine: </strong>
            If you ever stumble after a 15-day streak, your streak counter resets to 0,{" "}
            <span className="text-emerald-400 font-bold">but your 30-Day Victory Rate remains 93%+!</span>{" "}
            Every clean day permanently builds prefrontal brain grey matter. One slip does not destroy your progress!
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DAILY CHECK-IN CTA BUTTON                               */}
      {/* ======================================================== */}
      <button
        onClick={onOpenCheckIn}
        className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.99] text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-between shadow-lg shadow-emerald-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-950/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-slate-950" />
          </div>
          <div className="text-left">
            <span className="block text-sm font-extrabold normal-case">Log Today's Recovery Walk</span>
            <span className="block text-[10px] font-semibold text-emerald-950">Record urges, triggers & gratitude</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-950" />
      </button>

      {/* ======================================================== */}
      {/* DAILY NKJV ANCHOR CARD                                  */}
      {/* ======================================================== */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800/90 border border-slate-800 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Today's NKJV Anchor
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSaveVerse(dailyVerse.reference, dailyVerse.text)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              title="Save to My Vault"
            >
              {isSavedVerse(dailyVerse.reference) ? (
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleShareVerse}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              title="Share or Copy Scripture"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Verse Theme */}
        <h3 className="text-sm font-bold text-white tracking-tight">{dailyVerse.theme}</h3>

        {/* Verse Text */}
        <p className="text-xs font-serif italic text-slate-200 leading-relaxed">
          "{dailyVerse.text}"
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-bold text-amber-400">{dailyVerse.reference} (NKJV)</span>
          <button
            onClick={() => setShowMeditateModal(true)}
            className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            Meditate & Apply <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {copiedShare && (
          <p className="text-[10px] text-emerald-400 font-semibold animate-fade-in">
            ✓ Verse copied to clipboard!
          </p>
        )}
      </div>

      {/* Quick Summary Pill Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
            🏆
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              {profile.urgesDefeatedCount} Urges
            </span>
            <span className="text-[10px] text-slate-400">Defeated in battle</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
            🎯
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              {profile.goalDays} Days
            </span>
            <span className="text-[10px] text-slate-400">Target journey</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BIBLICAL MILESTONES MODAL                                */}
      {/* ======================================================== */}
      {showMilestonesModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#0D1322] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-5 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">Biblical Milestone Ranks</h2>
              </div>
              <button
                onClick={() => setShowMilestonesModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {BIBLICAL_MILESTONES.map((m) => {
                const isUnlocked = timeUnits.days >= m.days;
                return (
                  <div
                    key={m.days}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isUnlocked
                        ? "bg-slate-900/90 border-emerald-500/50 shadow-md shadow-emerald-500/5"
                        : "bg-slate-950/60 border-slate-800 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{m.badge}</span>
                        <div>
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            Day {m.days}: {m.title}
                            {isUnlocked && (
                              <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                Unlocked
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-amber-400/90 font-medium">{m.verse}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">{m.description}</p>
                    <p className="text-[10px] italic text-slate-400 font-serif mt-1">"{m.verseText}"</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCRIPTURE MEDITATION MODAL                               */}
      {/* ======================================================== */}
      {showMeditateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#0D1322] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                Scripture Meditation Guide
              </span>
              <button
                onClick={() => setShowMeditateModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{dailyVerse.theme}</h3>
              <span className="text-xs text-amber-400 font-semibold">{dailyVerse.reference} (NKJV)</span>
            </div>

            <p className="text-sm italic font-serif text-slate-200 p-4 rounded-2xl bg-slate-900 border border-slate-800 leading-relaxed">
              "{dailyVerse.text}"
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-300">Meditation Application:</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                {dailyVerse.meditationPrompt}
              </p>
            </div>

            <button
              onClick={() => {
                onSaveVerse(dailyVerse.reference, dailyVerse.text);
                setShowMeditateModal(false);
              }}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
            >
              Save to My Scripture Vault
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
