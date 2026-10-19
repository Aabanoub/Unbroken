"use client";

import React, { useState, useEffect } from "react";
import {
  UserProfile,
  DailyLog,
  SavedVerse,
  LogStatus,
  TimeOfDayOption,
  Language,
  ThemeMode,
} from "@/types";
import {
  calculateAddictionSeverityIndex,
  calculateStreakFromDate,
  getGlobalLanguage,
  setGlobalLanguage,
  getGlobalTheme,
  setGlobalTheme,
} from "@/lib/storage";
import { useStorage } from "@/context/StorageContext";
import { getTranslation } from "@/lib/i18n";
import { AuthGate } from "@/components/AuthGate";
import { PinLockScreen } from "@/components/PinLockScreen";
import { OnboardingAssessment } from "@/components/OnboardingAssessment";
import { HomeDashboard } from "@/components/HomeDashboard";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { ScriptureVault } from "@/components/ScriptureVault";
import { ShieldSettings } from "@/components/ShieldSettings";
import { BottomNav, NavTab } from "@/components/BottomNav";
import { UrgeRescueModal } from "@/components/UrgeRescueModal";
import { DailyCheckInModal } from "@/components/DailyCheckInModal";
import { GraceRelapseModal } from "@/components/GraceRelapseModal";
import {
  Lock,
  Shield,
  LogOut,
  Globe,
  Sun,
  Moon,
  Cloud,
  CloudOff,
  CloudUpload,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function AppRoot() {
  const {
    user,
    profile,
    dailyLogs,
    savedVerses,
    syncStatus,
    isOnline,
    updateProfile,
    addDailyLog,
    addSavedVerse,
    removeSavedVerse,
    resetApp,
    refreshData,
    logout,
  } = useStorage();

  // App Options: Language & Theme
  const [lang, setLang] = useState<Language>(() => {
    return getGlobalLanguage();
  });
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return getGlobalTheme();
  });

  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<NavTab>("home");

  // Modals
  const [showSOSModal, setShowSOSModal] = useState<boolean>(false);
  const [showCheckInModal, setShowCheckInModal] = useState<boolean>(false);
  const [showRelapseGraceModal, setShowRelapseGraceModal] = useState<boolean>(false);
  const [forceAssessment, setForceAssessment] = useState<boolean>(false);

  // Sync profile language & theme changes into local state
  useEffect(() => {
    if (profile?.language && profile.language !== lang) {
      setLang(profile.language);
      setGlobalLanguage(profile.language);
    }
    if (profile?.theme && profile.theme !== theme) {
      setTheme(profile.theme);
      setGlobalTheme(profile.theme);
    }
  }, [profile?.language, profile?.theme]);

  // Lock app if profile has a PIN code configured
  useEffect(() => {
    if (profile?.pinCode) {
      setIsUnlocked(false);
    } else {
      setIsUnlocked(true);
    }
  }, [profile?.pinCode]);

  const handleToggleLang = (targetLang?: Language) => {
    const newLang = targetLang || (lang === "ar" ? "en" : "ar");
    setLang(newLang);
    setGlobalLanguage(newLang);
    if (user && profile) {
      updateProfile({ language: newLang });
    }
  };

  const handleToggleTheme = (targetTheme?: ThemeMode) => {
    const newTheme = targetTheme || (theme === "light" ? "dark" : "light");
    setTheme(newTheme);
    setGlobalTheme(newTheme);
    if (user && profile) {
      updateProfile({ theme: newTheme });
    }
  };

  const handleSignOut = async () => {
    await logout();
    setIsUnlocked(true);
    setCurrentTab("home");
  };

  const isLight = theme === "light";
  const t = getTranslation(lang);

  // 1. AUTH GATE (Shown when user is not authenticated)
  if (!user) {
    return (
      <AuthGate
        lang={lang}
        theme={theme}
        onToggleLang={handleToggleLang}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  // 2. LOADING USER SPACE
  if (!profile) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center text-xs ${
          isLight ? "bg-slate-50 text-slate-500" : "bg-[#090D16] text-slate-400"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <Shield className="w-9 h-9 text-emerald-500 animate-pulse stroke-[2.5]" />
          <p className="font-semibold tracking-wide">
            {lang === "ar" ? "جاري تهيئة مساحة الاسترداد..." : "Preparing Unbroken Recovery Space..."}
          </p>
        </div>
      </div>
    );
  }

  // 3. PIN LOCK SCREEN (If PIN lock is active for this profile)
  if (profile.pinCode && !isUnlocked) {
    return (
      <PinLockScreen
        correctPin={profile.pinCode}
        disguiseTitle={profile.disguiseTitle}
        onUnlock={() => setIsUnlocked(true)}
        onResetPin={() => {
          updateProfile({ pinCode: null });
          setIsUnlocked(true);
        }}
        lang={lang}
        theme={theme}
        userId={user.id}
      />
    );
  }

  // 4. ONBOARDING ASSESSMENT (If user has not finished assessment or retake requested)
  if (!profile.onboardingCompleted || forceAssessment) {
    return (
      <OnboardingAssessment
        initialProfile={profile}
        onComplete={(updates) => {
          updateProfile(updates);
          setForceAssessment(false);
        }}
        lang={lang}
        theme={theme}
        onToggleLang={(targetLang) => handleToggleLang(targetLang)}
      />
    );
  }

  // Handlers for user daily logs and metrics
  const handleSubmitDailyLog = (logData: {
    status: LogStatus;
    urgeIntensity: number;
    triggers: string[];
    timeOfDay: TimeOfDayOption;
    journalNote: string;
  }) => {
    const today = new Date().toISOString().split("T")[0];
    addDailyLog({
      logDate: today,
      status: logData.status,
      urgeIntensity: logData.urgeIntensity,
      triggers: logData.triggers,
      timeOfDay: logData.timeOfDay,
      journalNote: logData.journalNote,
    });

    if (logData.status === "urge_defeated") {
      const updatedUrges = profile.urgesDefeatedCount + 1;
      const updatedIndex = calculateAddictionSeverityIndex(
        profile.onboardingScore,
        profile.longestStreakDays,
        updatedUrges
      );
      updateProfile({
        urgesDefeatedCount: updatedUrges,
        currentAddictionIndex: updatedIndex,
      });
    }
  };

  const handleVictorySOS = (journalNote?: string) => {
    const today = new Date().toISOString().split("T")[0];
    addDailyLog({
      logDate: today,
      status: "urge_defeated",
      urgeIntensity: 8,
      triggers: ["Bored", "Late Night Phone"],
      timeOfDay: "Evening",
      journalNote: journalNote || "Victory over intense urge with SOS Protocol",
    });

    const updatedUrges = profile.urgesDefeatedCount + 1;
    const updatedIndex = calculateAddictionSeverityIndex(
      profile.onboardingScore,
      profile.longestStreakDays,
      updatedUrges
    );

    updateProfile({
      urgesDefeatedCount: updatedUrges,
      currentAddictionIndex: updatedIndex,
    });
  };

  const handleRelapseReset = (environmentalAdjustment: string) => {
    const today = new Date().toISOString().split("T")[0];
    addDailyLog({
      logDate: today,
      status: "relapse",
      urgeIntensity: 9,
      triggers: ["Late Night Phone", "Tired"],
      timeOfDay: "Late Night 11PM-3AM",
      journalNote: `Relapse occurred. Environmental change committed: ${environmentalAdjustment}`,
    });

    const currentStreak = calculateStreakFromDate(profile.streakStartTimestamp);
    const newLongest = Math.max(profile.longestStreakDays || 0, currentStreak);

    updateProfile({
      streakStartTimestamp: new Date().toISOString(),
      longestStreakDays: newLongest,
    });
  };

  const handleSaveVerse = (reference: string, text: string) => {
    addSavedVerse({
      reference,
      verseText: text,
      personalReflection: "Saved from daily Unbroken Scripture meditation.",
    });
  };

  const handleSaveVerseWithReflection = (
    reference: string,
    text: string,
    reflection: string
  ) => {
    addSavedVerse({
      reference,
      verseText: text,
      personalReflection: reflection,
    });
  };

  const handleRemoveSavedVerse = (id: string) => {
    removeSavedVerse(id);
  };

  const handleResetData = (type: "fresh" | "demo") => {
    resetApp(type);
    if (type === "fresh") {
      setForceAssessment(true);
    }
  };

  const isVerseSaved = (ref: string) => savedVerses.some((v) => v.reference === ref);

  const tierShortLabel = () => {
    const rawTier = profile.addictionTier;
    if (lang === "ar") {
      if (rawTier.includes("Level 1")) return "المستوى ١";
      if (rawTier.includes("Level 2")) return "المستوى ٢";
      return "المستوى ٣";
    }
    return rawTier.split("—")[0].trim();
  };

  return (
    <main
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`min-h-screen ${
        isLight
          ? "light bg-slate-50 text-slate-900 selection:bg-emerald-500/30"
          : "dark bg-[#090D16] text-slate-100 selection:bg-emerald-500/30"
      } flex justify-center transition-colors duration-200`}
    >
      {/* Mobile-First Frame */}
      <div
        className={`w-full max-w-md min-h-screen ${
          isLight
            ? "bg-slate-50 border-x border-slate-200"
            : "bg-[#090D16] border-x border-slate-900"
        } flex flex-col relative px-4 pt-3 shadow-2xl transition-colors duration-200`}
      >
        {/* App Top Bar */}
        <header
          className={`flex items-center justify-between py-2 border-b mb-3 transition-colors ${
            isLight ? "border-slate-200" : "border-slate-900"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
              <Shield className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span
                className={`text-sm font-black tracking-tight block ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                {profile.disguiseTitle ? t.brand.disguiseTitle : t.brand.appName}
              </span>
              <span
                className={`text-[9px] font-semibold tracking-wider block -mt-0.5 ${
                  isLight ? "text-emerald-700 font-bold" : "text-emerald-400"
                }`}
              >
                {profile.disguiseTitle ? t.brand.disguiseSubtitle : t.brand.slogan}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* STEP 5.2: Live Sync Health Badge (Synced, Saving..., or Offline Mode) */}
            <button
              onClick={() => refreshData()}
              title={
                syncStatus === "offline" || !isOnline
                  ? lang === "ar"
                    ? "وضع غير متصل - سيتم رفع التعديلات تلقائياً فور عودة الاتصال"
                    : "Offline Mode - Queued changes sync when online"
                  : syncStatus === "syncing"
                  ? lang === "ar"
                    ? "جاري المزامنة مع سحابة Supabase..."
                    : "Saving to Supabase Cloud..."
                  : syncStatus === "error"
                  ? lang === "ar"
                    ? "تنبيه مزامنة - انقر لإعادة المحاولة"
                    : "Sync Alert - Click to retry"
                  : lang === "ar"
                  ? "متزامن مع سحابة Supabase ومحفوظ محلياً (0ms)"
                  : "Synced to Supabase Cloud & Local (0ms)"
              }
              className={`px-2.5 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                syncStatus === "offline" || !isOnline
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  : syncStatus === "syncing"
                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
                  : syncStatus === "error"
                  ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                  : isLight
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              }`}
            >
              {syncStatus === "offline" || !isOnline ? (
                <>
                  <CloudOff className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>{lang === "ar" ? "وضع غير متصل" : "Offline Mode"}</span>
                </>
              ) : syncStatus === "syncing" ? (
                <>
                  <CloudUpload className="w-3 h-3 text-indigo-400 animate-spin shrink-0" />
                  <span>{lang === "ar" ? "جاري الحفظ..." : "Saving..."}</span>
                </>
              ) : syncStatus === "error" ? (
                <>
                  <CloudOff className="w-3 h-3 text-rose-500 shrink-0" />
                  <span>{lang === "ar" ? "تنبيه مزامنة" : "Sync Alert"}</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>{lang === "ar" ? "متزامن" : "Synced"}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                </>
              )}
            </button>

            {/* Quick Language Toggle */}
            <button
              onClick={() => handleToggleLang()}
              className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-all ${
                isLight
                  ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:text-emerald-400 hover:bg-slate-800"
              }`}
              title={t.header.switchLang}
            >
              <Globe className="w-3 h-3 text-emerald-500" />
              <span>{lang === "ar" ? "EN" : "عربي"}</span>
            </button>

            {/* Quick Theme Toggle */}
            <button
              onClick={() => handleToggleTheme()}
              className={`p-1.5 rounded-lg border transition-all ${
                isLight
                  ? "bg-white border-slate-200 text-amber-600 hover:bg-slate-100 shadow-sm"
                  : "bg-slate-900 border-slate-800 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800"
              }`}
              title={t.header.switchTheme}
            >
              {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>

            {/* PIN Lock button if configured */}
            {profile.pinCode && (
              <button
                onClick={() => setIsUnlocked(false)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isLight
                    ? "bg-white border-slate-200 text-slate-600 hover:text-emerald-600 shadow-sm"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-emerald-400"
                }`}
                title={t.header.lockTitle}
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Sign Out button */}
            <button
              onClick={handleSignOut}
              className={`p-1.5 rounded-lg border transition-colors ${
                isLight
                  ? "bg-white border-slate-200 text-slate-500 hover:text-rose-500 shadow-sm"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400"
              }`}
              title={`${t.header.signOutTitle} (${user.email})`}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>

            {/* Tier Badge */}
            <span
              className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md border ${
                isLight
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              {tierShortLabel()}
            </span>
          </div>
        </header>

        {/* Tab Views */}
        <div className="flex-1">
          {currentTab === "home" && (
            <HomeDashboard
              profile={profile}
              dailyLogs={dailyLogs}
              onOpenCheckIn={() => setShowCheckInModal(true)}
              onOpenSOS={() => setShowSOSModal(true)}
              onSaveVerse={handleSaveVerse}
              isSavedVerse={isVerseSaved}
              lang={lang}
              theme={theme}
            />
          )}

          {currentTab === "analytics" && (
            <AnalyticsDashboard
              profile={profile}
              dailyLogs={dailyLogs}
              lang={lang}
              theme={theme}
            />
          )}

          {currentTab === "scripture" && (
            <ScriptureVault
              savedVerses={savedVerses}
              onSaveVerseWithReflection={handleSaveVerseWithReflection}
              onRemoveSavedVerse={handleRemoveSavedVerse}
              lang={lang}
              theme={theme}
            />
          )}

          {currentTab === "shield" && (
            <ShieldSettings
              profile={profile}
              currentUser={user}
              onUpdateProfile={updateProfile}
              onRetakeAssessment={() => setForceAssessment(true)}
              onResetData={handleResetData}
              onLockApp={() => setIsUnlocked(false)}
              onSignOut={handleSignOut}
              lang={lang}
              theme={theme}
              onToggleLang={(l) => handleToggleLang(l)}
              onToggleTheme={(t) => handleToggleTheme(t)}
            />
          )}
        </div>

        {/* Fixed Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenSOS={() => setShowSOSModal(true)}
          lang={lang}
          theme={theme}
        />

        {/* Modals */}
        <UrgeRescueModal
          isOpen={showSOSModal}
          onClose={() => setShowSOSModal(false)}
          onVictory={handleVictorySOS}
          lang={lang}
          theme={theme}
        />

        <DailyCheckInModal
          isOpen={showCheckInModal}
          onClose={() => setShowCheckInModal(false)}
          onSubmitLog={handleSubmitDailyLog}
          onOpenRelapseGraceModal={() => setShowRelapseGraceModal(true)}
          lang={lang}
          theme={theme}
        />

        <GraceRelapseModal
          isOpen={showRelapseGraceModal}
          onClose={() => setShowRelapseGraceModal(false)}
          onConfirmReset={handleRelapseReset}
          lang={lang}
          theme={theme}
        />
      </div>
    </main>
  );
}
