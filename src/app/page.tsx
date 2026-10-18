"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, DailyLog, SavedVerse, LogStatus, TimeOfDayOption, AuthUser, Language, ThemeMode } from "@/types";
import {
  getCurrentSession,
  logoutUser,
  getUserProfile,
  saveUserProfile,
  getUserDailyLogs,
  saveUserDailyLog,
  getUserSavedVerses,
  saveUserVerse,
  removeUserVerse,
  resetAppData,
  calculateAddictionSeverityIndex,
  getGlobalLanguage,
  setGlobalLanguage,
  getGlobalTheme,
  setGlobalTheme,
} from "@/lib/storage";
import { getTranslation } from "@/lib/i18n";
import { LoginPage } from "@/components/LoginPage";
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
import { Lock, Shield, LogOut, Globe, Sun, Moon } from "lucide-react";

export default function AppRoot() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // App Options: Language & Theme
  const [lang, setLang] = useState<Language>("en");
  const [theme, setTheme] = useState<ThemeMode>("dark");

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>([]);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<NavTab>("home");

  // Modals
  const [showSOSModal, setShowSOSModal] = useState<boolean>(false);
  const [showCheckInModal, setShowCheckInModal] = useState<boolean>(false);
  const [showRelapseGraceModal, setShowRelapseGraceModal] = useState<boolean>(false);
  const [forceAssessment, setForceAssessment] = useState<boolean>(false);

  // Initialize language & theme from storage
  useEffect(() => {
    const savedLang = getGlobalLanguage();
    const savedTheme = getGlobalTheme();
    setLang(savedLang);
    setTheme(savedTheme);
  }, []);

  // Initialize session on mount
  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      loadUserData(session);
    } else {
      setAuthChecking(false);
    }
  }, []);

  const loadUserData = (user: AuthUser) => {
    setCurrentUser(user);
    const userProfile = getUserProfile(user.id);
    const userLogs = getUserDailyLogs(user.id);
    const userVerses = getUserSavedVerses(user.id);

    setProfile(userProfile);
    setDailyLogs(userLogs);
    setSavedVerses(userVerses);

    // Apply saved user preferences if available
    if (userProfile.language) {
      setLang(userProfile.language);
      setGlobalLanguage(userProfile.language);
    }
    if (userProfile.theme) {
      setTheme(userProfile.theme);
      setGlobalTheme(userProfile.theme);
    }

    // If PIN is enabled for this user, lock by default
    if (userProfile.pinCode) {
      setIsUnlocked(false);
    } else {
      setIsUnlocked(true);
    }

    setAuthChecking(false);
  };

  const handleAuthSuccess = (user: AuthUser) => {
    loadUserData(user);
  };

  const handleSignOut = async () => {
    await logoutUser();
    setCurrentUser(null);
    setProfile(null);
    setDailyLogs([]);
    setSavedVerses([]);
    setIsUnlocked(true);
    setCurrentTab("home");
  };

  const handleToggleLang = (targetLang?: Language) => {
    const newLang = targetLang || (lang === "ar" ? "en" : "ar");
    setLang(newLang);
    setGlobalLanguage(newLang);
    if (currentUser && profile) {
      handleUpdateProfile({ language: newLang });
    }
  };

  const handleToggleTheme = (targetTheme?: ThemeMode) => {
    const newTheme = targetTheme || (theme === "light" ? "dark" : "light");
    setTheme(newTheme);
    setGlobalTheme(newTheme);
    if (currentUser && profile) {
      handleUpdateProfile({ theme: newTheme });
    }
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = saveUserProfile(currentUser.id, updates);
    setProfile(updated);
  };

  const isLight = theme === "light";
  const t = getTranslation(lang);

  if (authChecking) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center text-xs ${
          isLight ? "bg-slate-50 text-slate-500" : "bg-[#090D16] text-slate-500"
        }`}
      >
        Loading Unbroken Recovery Engine...
      </div>
    );
  }

  // 1. LOGIN & REGISTRATION PAGE (Shown when user is not authenticated)
  if (!currentUser) {
    return (
      <LoginPage
        onAuthSuccess={handleAuthSuccess}
        lang={lang}
        theme={theme}
        onToggleLang={() => handleToggleLang()}
        onToggleTheme={() => handleToggleTheme()}
      />
    );
  }

  if (!profile) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center text-xs ${
          isLight ? "bg-slate-50 text-slate-500" : "bg-[#090D16] text-slate-500"
        }`}
      >
        Preparing User Space...
      </div>
    );
  }

  // 2. PIN LOCK SCREEN (If PIN protection is enabled for this user)
  if (profile.pinCode && !isUnlocked) {
    return (
      <PinLockScreen
        correctPin={profile.pinCode}
        disguiseTitle={profile.disguiseTitle}
        onUnlock={() => setIsUnlocked(true)}
        onResetPin={() => {
          const updated = saveUserProfile(currentUser.id, { pinCode: null });
          setProfile(updated);
          setIsUnlocked(true);
        }}
        lang={lang}
        theme={theme}
      />
    );
  }

  // 3. ONBOARDING ASSESSMENT (If user has not taken assessment or retake requested)
  if (!profile.onboardingCompleted || forceAssessment) {
    return (
      <OnboardingAssessment
        initialProfile={profile}
        onComplete={(updates) => {
          const updated = saveUserProfile(currentUser.id, updates);
          setProfile(updated);
          setForceAssessment(false);
        }}
        lang={lang}
        theme={theme}
        onToggleLang={(targetLang) => handleToggleLang(targetLang)}
      />
    );
  }

  // Handlers for user logs and metrics
  const handleSubmitDailyLog = (logData: {
    status: LogStatus;
    urgeIntensity: number;
    triggers: string[];
    timeOfDay: TimeOfDayOption;
    journalNote: string;
  }) => {
    const today = new Date().toISOString().split("T")[0];
    saveUserDailyLog(currentUser.id, {
      logDate: today,
      status: logData.status,
      urgeIntensity: logData.urgeIntensity,
      triggers: logData.triggers,
      timeOfDay: logData.timeOfDay,
      journalNote: logData.journalNote,
    });

    const refreshedLogs = getUserDailyLogs(currentUser.id);
    setDailyLogs(refreshedLogs);

    if (logData.status === "urge_defeated") {
      const updatedUrges = profile.urgesDefeatedCount + 1;
      const updatedIndex = calculateAddictionSeverityIndex(
        profile.onboardingScore,
        profile.longestStreakDays,
        updatedUrges
      );
      handleUpdateProfile({
        urgesDefeatedCount: updatedUrges,
        currentAddictionIndex: updatedIndex,
      });
    }
  };

  const handleVictorySOS = (journalNote?: string) => {
    const today = new Date().toISOString().split("T")[0];
    saveUserDailyLog(currentUser.id, {
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

    const updated = saveUserProfile(currentUser.id, {
      urgesDefeatedCount: updatedUrges,
      currentAddictionIndex: updatedIndex,
    });

    setProfile(updated);
    setDailyLogs(getUserDailyLogs(currentUser.id));
  };

  const handleRelapseReset = (environmentalAdjustment: string) => {
    const today = new Date().toISOString().split("T")[0];
    saveUserDailyLog(currentUser.id, {
      logDate: today,
      status: "relapse",
      urgeIntensity: 9,
      triggers: ["Late Night Phone", "Tired"],
      timeOfDay: "Late Night 11PM-3AM",
      journalNote: `Relapse occurred. Environmental change committed: ${environmentalAdjustment}`,
    });

    const updated = saveUserProfile(currentUser.id, {
      streakStartTimestamp: new Date().toISOString(),
    });

    setProfile(updated);
    setDailyLogs(getUserDailyLogs(currentUser.id));
  };

  const handleSaveVerse = (reference: string, text: string) => {
    saveUserVerse(currentUser.id, {
      reference,
      verseText: text,
      personalReflection: "Saved from daily Unbroken Scripture meditation.",
    });
    setSavedVerses(getUserSavedVerses(currentUser.id));
  };

  const handleSaveVerseWithReflection = (
    reference: string,
    text: string,
    reflection: string
  ) => {
    saveUserVerse(currentUser.id, {
      reference,
      verseText: text,
      personalReflection: reflection,
    });
    setSavedVerses(getUserSavedVerses(currentUser.id));
  };

  const handleRemoveSavedVerse = (id: string) => {
    removeUserVerse(currentUser.id, id);
    setSavedVerses(getUserSavedVerses(currentUser.id));
  };

  const handleResetData = (type: "fresh" | "demo") => {
    resetAppData(type);
    const refreshedProfile = getUserProfile(currentUser.id);
    setProfile(refreshedProfile);
    setDailyLogs(getUserDailyLogs(currentUser.id));
    setSavedVerses(getUserSavedVerses(currentUser.id));

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
              title={`${t.header.signOutTitle} (${currentUser.email})`}
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
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
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
