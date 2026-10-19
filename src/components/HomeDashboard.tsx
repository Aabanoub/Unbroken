"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, DailyLog, SavedVerse, Milestone, Language, ThemeMode } from "@/types";
import { BIBLICAL_MILESTONES } from "@/lib/constants";
import { getDailyVerse } from "@/data/nkjv-verses";
import { calculate30DayVictoryRate } from "@/lib/storage";
import { getTranslation, getLocalizedVerse, getLocalizedMilestone } from "@/lib/i18n";
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
  lang?: Language;
  theme?: ThemeMode;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  dailyLogs,
  onOpenCheckIn,
  onOpenSOS,
  onSaveVerse,
  isSavedVerse,
  lang = "en",
  theme = "dark",
}) => {
  const [timeUnits, setTimeUnits] = useState({ days: 0, hours: 0, minutes: 0 });
  const [showMilestonesModal, setShowMilestonesModal] = useState(false);
  const [showMeditateModal, setShowMeditateModal] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const t = getTranslation(lang);
  const isLight = theme === "light";

  const rawDailyVerse = getDailyVerse();
  const dailyVerse = getLocalizedVerse(rawDailyVerse, lang);
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
  const rawCurrentMilestone =
    [...BIBLICAL_MILESTONES]
      .reverse()
      .find((m) => timeUnits.days >= m.days) || BIBLICAL_MILESTONES[0];
  const currentMilestone = getLocalizedMilestone(rawCurrentMilestone, lang);

  // Next milestone
  const rawNextMilestone =
    BIBLICAL_MILESTONES.find((m) => m.days > timeUnits.days) ||
    BIBLICAL_MILESTONES[BIBLICAL_MILESTONES.length - 1];
  const nextMilestone = getLocalizedMilestone(rawNextMilestone, lang);

  // Circular Streak Ring percentage calculation: Math.min(100, Math.round((current_streak / roadmap_days) * 100))
  const roadmapDays = profile.goalDays || 21;
  const streakPercent = Math.min(100, Math.round((timeUnits.days / roadmapDays) * 100));

  const circumference = 2 * Math.PI * 72; // radius 72
  const strokeDashoffset = circumference - (Math.max(streakPercent, 2) / 100) * circumference;

  const handleShareVerse = () => {
    const shareText = `"${dailyVerse.text}" — ${dailyVerse.reference}\n\n${t.brand.slogan}\n${t.brand.appName}`;
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
          <span
            className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${
              isLight ? "text-emerald-700" : "text-emerald-400"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {lang === "ar" ? "مسيرة النعمة والطهارة" : "Walking in Grace"}
          </span>
          <h1
            className={`text-xl font-black tracking-tight ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            {lang === "ar" ? `مرحباً بك، ${profile.displayName}` : `Welcome back, ${profile.displayName}`}
          </h1>
        </div>

        {/* Milestone Badge Pill */}
        <button
          onClick={() => setShowMilestonesModal(true)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm border ${
            isLight
              ? "bg-white border-amber-300 text-amber-800 hover:bg-amber-50"
              : "bg-slate-900 border-amber-500/30 text-amber-300 hover:bg-slate-800"
          }`}
        >
          <span>{currentMilestone.badge}</span>
          <span className="max-w-[100px] truncate">{currentMilestone.title}</span>
        </button>
      </div>

      {/* Official Slogan Banner Card */}
      <div
        className={`p-3.5 rounded-2xl flex items-center gap-3 shadow-md border ${
          isLight
            ? "bg-gradient-to-r from-emerald-50 via-white to-teal-50 border-emerald-200 text-slate-800"
            : "bg-gradient-to-r from-emerald-500/10 via-slate-900 to-teal-500/10 border-emerald-500/30"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            isLight
              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
              : "bg-emerald-500/20 text-emerald-400"
          }`}
        >
          <Shield className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black uppercase tracking-wider ${
                isLight ? "text-emerald-800" : "text-emerald-400"
              }`}
            >
              {t.brand.slogan}
            </span>
          </div>
          <p
            className={`text-[11px] font-serif italic leading-snug mt-0.5 ${
              isLight ? "text-slate-600" : "text-slate-300"
            }`}
          >
            &ldquo;{t.brand.proverbsText}&rdquo; — {t.brand.proverbsRef}
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ANIMATED CIRCULAR STREAK RING                           */}
      {/* ======================================================== */}
      <div
        className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden flex flex-col items-center transition-colors ${
          isLight
            ? "bg-gradient-to-b from-white to-slate-50 border-slate-200"
            : "bg-gradient-to-b from-slate-900/90 to-[#0B1120] border-slate-800"
        }`}
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-56 h-56 flex items-center justify-center my-2">
          {/* SVG Progress Ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r="72"
              className={isLight ? "text-slate-200" : "text-slate-800/80"}
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
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
              <Flame className="w-4 h-4 fill-amber-500 shrink-0" />
              <span className="text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
                {lang === "ar" ? "سلسلة الطهارة" : "Current Streak"}
              </span>
            </div>
            <div
              className={`text-5xl font-black tracking-tight leading-none my-1 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {timeUnits.days}
              <span
                className={`text-base font-bold ml-1 ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {t.home.days}
              </span>
            </div>
            <div
              className={`text-xs font-mono font-medium mt-0.5 ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {timeUnits.hours} {t.home.hours} {timeUnits.minutes} {t.home.mins}
            </div>
            <div
              className={`mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border shadow-sm ${
                isLight
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
              }`}
            >
              {streakPercent}% {lang === "ar" ? `من هدف الـ ${roadmapDays} يوماً` : `of ${roadmapDays}-Day Goal`}
            </div>
          </div>
        </div>

        {/* Milestone Indicator Footer */}
        <div
          className={`w-full mt-4 pt-3 border-t flex items-center justify-between text-xs ${
            isLight ? "border-slate-200" : "border-slate-800/80"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{currentMilestone.badge}</span>
            <div>
              <span className={`font-bold block ${isLight ? "text-slate-900" : "text-white"}`}>
                {currentMilestone.title}
              </span>
              <span className={`text-[10px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {t.home.nextMilestone}: {nextMilestone.title} ({nextMilestone.days} {t.home.days})
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowMilestonesModal(true)}
            className={`text-[11px] font-semibold flex items-center gap-0.5 ${
              isLight ? "text-emerald-700 hover:text-emerald-800" : "text-emerald-400 hover:text-emerald-300"
            }`}
          >
            <span>{t.home.viewMilestones}</span>
            <ChevronRight className={`w-3.5 h-3.5 ${lang === "ar" ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* THE "30-DAY VICTORY RATE" METRIC (CRUCIAL ANTI-DESPAIR)  */}
      {/* ======================================================== */}
      <div
        className={`p-4 rounded-2xl border space-y-3 shadow-md transition-colors ${
          isLight
            ? "bg-white border-slate-200 text-slate-800"
            : "bg-slate-900/80 border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                isLight
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              }`}
            >
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                {t.analytics.victoryRate30}
              </span>
              <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {lang === "ar" ? "مقياس الثبات العصبي وإعادة البرمجة" : "Neurological consistency metric"}
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-1">
            <span
              className={`text-2xl font-black ${
                isLight ? "text-emerald-700" : "text-emerald-400"
              }`}
            >
              {victoryRate}%
            </span>
            <span
              className={`text-[10px] font-semibold ${
                isLight ? "text-slate-500" : "text-slate-500"
              }`}
            >
              {lang === "ar" ? "انتصار" : "win rate"}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className={`w-full h-2.5 rounded-full overflow-hidden ${
            isLight ? "bg-slate-200" : "bg-slate-800"
          }`}
        >
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${victoryRate}%` }}
          />
        </div>

        {/* Anti-Despair Reassurance Box */}
        <div
          className={`p-2.5 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 ${
            isLight
              ? "bg-emerald-50/70 border-emerald-200/80 text-slate-700"
              : "bg-slate-950/70 border-slate-800/80 text-slate-400"
          }`}
        >
          <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p>
            <strong className={isLight ? "text-slate-900" : "text-slate-200"}>
              {lang === "ar" ? "حماية من الإحباط: " : "Anti-Despair Engine: "}
            </strong>
            {lang === "ar" ? (
              <>
                إذا تعثرت بعد سلسلة ١٥ يوماً، يعود العداد الصغير للصفر، لكن{" "}
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  معدل نصرتك الشهري يبقى ٩٣٪+!
                </span>{" "}
                كل يوم طاهر يبني كتلة الفص الجبهي بشكل دائم. سقطة واحدة لا تضيع كل جهادك السابق!
              </>
            ) : (
              <>
                If you ever stumble after a 15-day streak, your streak counter resets to 0,{" "}
                <span className="text-emerald-500 font-bold">
                  but your 30-Day Victory Rate remains 93%+!
                </span>{" "}
                Every clean day permanently builds prefrontal brain grey matter. One slip does not destroy your progress!
              </>
            )}
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
          <div className={lang === "ar" ? "text-right" : "text-left"}>
            <span className="block text-sm font-extrabold normal-case">
              {t.home.checkInBtn}
            </span>
            <span className="block text-[10px] font-semibold text-emerald-950">
              {lang === "ar"
                ? "تسجيل الشهوات، المحفزات، والصلوات"
                : "Record urges, triggers & gratitude"}
            </span>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-slate-950 ${lang === "ar" ? "rotate-180" : ""}`} />
      </button>

      {/* ======================================================== */}
      {/* DAILY NKJV ANCHOR CARD                                  */}
      {/* ======================================================== */}
      <div
        className={`p-5 rounded-3xl border space-y-3 shadow-lg transition-colors ${
          isLight
            ? "bg-gradient-to-br from-white to-slate-50 border-slate-200"
            : "bg-gradient-to-br from-slate-900 to-slate-800/90 border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${
              isLight
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            {t.home.dailyVerseTitle}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSaveVerse(dailyVerse.reference, dailyVerse.text)}
              className={`p-1.5 rounded-lg border transition-all ${
                isLight
                  ? "bg-white hover:bg-slate-100 border-slate-200 text-slate-700"
                  : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white"
              }`}
              title={t.home.saveVerse}
            >
              {isSavedVerse(dailyVerse.reference) ? (
                <BookmarkCheck className="w-4 h-4 text-emerald-500" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleShareVerse}
              className={`p-1.5 rounded-lg border transition-all ${
                isLight
                  ? "bg-white hover:bg-slate-100 border-slate-200 text-slate-700"
                  : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white"
              }`}
              title={t.home.share}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Verse Theme */}
        <h3
          className={`text-sm font-bold tracking-tight ${
            isLight ? "text-slate-900" : "text-white"
          }`}
        >
          {dailyVerse.theme}
        </h3>

        {/* Verse Text */}
        <p
          className={`text-xs font-serif italic leading-relaxed ${
            isLight ? "text-slate-700" : "text-slate-200"
          }`}
        >
          &ldquo;{dailyVerse.text}&rdquo;
        </p>

        <div className="flex items-center justify-between pt-1">
          <span
            className={`text-xs font-bold ${
              isLight ? "text-amber-800" : "text-amber-400"
            }`}
          >
            {dailyVerse.reference}
          </span>
          <button
            onClick={() => setShowMeditateModal(true)}
            className={`text-[11px] font-semibold flex items-center gap-1 ${
              isLight ? "text-emerald-700 hover:text-emerald-800" : "text-emerald-400 hover:text-emerald-300"
            }`}
          >
            <span>{t.home.meditate}</span>
            <ChevronRight className={`w-3 h-3 ${lang === "ar" ? "rotate-180" : ""}`} />
          </button>
        </div>

        {copiedShare && (
          <p className="text-[10px] text-emerald-500 font-semibold animate-fade-in">
            ✓ {t.home.copied}
          </p>
        )}
      </div>

      {/* Quick Summary Pill Row */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${
            isLight
              ? "bg-white border-slate-200 text-slate-800 shadow-sm"
              : "bg-slate-900/70 border-slate-800"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm border ${
              isLight
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
            }`}
          >
            🏆
          </div>
          <div>
            <span
              className={`text-xs font-bold block ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {profile.urgesDefeatedCount} {t.home.urgesDefeated}
            </span>
            <span className={`text-[10px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {lang === "ar" ? "انتصارات في معركة الطهارة" : "Defeated in battle"}
            </span>
          </div>
        </div>

        <div
          className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${
            isLight
              ? "bg-white border-slate-200 text-slate-800 shadow-sm"
              : "bg-slate-900/70 border-slate-800"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm border ${
              isLight
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}
          >
            🎯
          </div>
          <div>
            <span
              className={`text-xs font-bold block ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {profile.goalDays} {t.home.days}
            </span>
            <span className={`text-[10px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {lang === "ar" ? "الهدف المستهدف" : "Target journey"}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BIBLICAL MILESTONES MODAL                                */}
      {/* ======================================================== */}
      {showMilestonesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            dir={lang === "ar" ? "rtl" : "ltr"}
            className={`w-full max-w-md border-t sm:border rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-5 shadow-2xl relative transition-colors ${
              isLight
                ? "bg-white border-slate-200 text-slate-900"
                : "bg-[#0D1322] border-slate-800 text-slate-100"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold">{t.home.milestoneModalTitle}</h2>
              </div>
              <button
                onClick={() => setShowMilestonesModal(false)}
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  isLight
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {BIBLICAL_MILESTONES.map((rawM) => {
                const m = getLocalizedMilestone(rawM, lang);
                const isUnlocked = timeUnits.days >= m.days;
                return (
                  <div
                    key={m.days}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isUnlocked
                        ? isLight
                          ? "bg-emerald-50/80 border-emerald-300 shadow-sm"
                          : "bg-slate-900/90 border-emerald-500/50 shadow-md shadow-emerald-500/5"
                        : isLight
                        ? "bg-slate-100/70 border-slate-200 opacity-60"
                        : "bg-slate-950/60 border-slate-800 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{m.badge}</span>
                        <div>
                          <span
                            className={`text-xs font-bold flex items-center gap-1.5 ${
                              isLight ? "text-slate-900" : "text-white"
                            }`}
                          >
                            {lang === "ar" ? `اليوم ${m.days}: ${m.title}` : `Day ${m.days}: ${m.title}`}
                            {isUnlocked && (
                              <span
                                className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                                  isLight
                                    ? "bg-emerald-600 text-white"
                                    : "bg-emerald-500/20 text-emerald-400"
                                }`}
                              >
                                {lang === "ar" ? "تم الإنجاز" : "Unlocked"}
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-amber-600 dark:text-amber-400/90 font-medium">
                            {m.verse}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p
                      className={`text-[11px] mt-2 leading-relaxed ${
                        isLight ? "text-slate-700" : "text-slate-300"
                      }`}
                    >
                      {m.description}
                    </p>
                    <p
                      className={`text-[10px] italic font-serif mt-1 ${
                        isLight ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      &ldquo;{m.verseText}&rdquo;
                    </p>
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            dir={lang === "ar" ? "rtl" : "ltr"}
            className={`w-full max-w-md border-t sm:border rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative space-y-4 transition-colors ${
              isLight
                ? "bg-white border-slate-200 text-slate-900"
                : "bg-[#0D1322] border-slate-800 text-slate-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                {t.home.meditatePrompt}
              </span>
              <button
                onClick={() => setShowMeditateModal(false)}
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  isLight
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className={`text-base font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                {dailyVerse.theme}
              </h3>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                {dailyVerse.reference}
              </span>
            </div>

            <p
              className={`text-sm italic font-serif p-4 rounded-2xl border leading-relaxed ${
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-800"
                  : "bg-slate-900 border-slate-800 text-slate-200"
              }`}
            >
              &ldquo;{dailyVerse.text}&rdquo;
            </p>

            <div
              className={`p-3.5 rounded-xl border space-y-1 ${
                isLight
                  ? "bg-emerald-50/50 border-emerald-200/60"
                  : "bg-slate-900/60 border-slate-800"
              }`}
            >
              <span className={`text-xs font-bold ${isLight ? "text-slate-900" : "text-slate-300"}`}>
                {lang === "ar" ? "التطبيق العملي للتأمل:" : "Meditation Application:"}
              </span>
              <p className={`text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                {dailyVerse.meditationPrompt}
              </p>
            </div>

            <button
              onClick={() => {
                onSaveVerse(dailyVerse.reference, dailyVerse.text);
                setShowMeditateModal(false);
              }}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
            >
              {t.home.saveVerse}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
