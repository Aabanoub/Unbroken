"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, DailyLog, SavedVerse, LogStatus, TimeOfDayOption, AuthUser } from "@/types";
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
} from "@/lib/storage";
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
import { Lock, Sparkles, Shield, LogOut, User as UserIcon } from "lucide-react";

export default function AppRoot() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

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

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center text-slate-500 text-xs">
        Loading Unbroken Recovery Engine...
      </div>
    );
  }

  // 1. LOGIN & REGISTRATION PAGE (Shown when user is not authenticated)
  if (!currentUser) {
    return <LoginPage onAuthSuccess={handleAuthSuccess} />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center text-slate-500 text-xs">
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
      />
    );
  }

  // Data Update Handlers (Quarantined by currentUser.id)
  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    const updated = saveUserProfile(currentUser.id, updates);
    setProfile(updated);
  };

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

  return (
    <main className="min-h-screen bg-[#090D16] text-slate-100 flex justify-center selection:bg-emerald-500/30">
      {/* Mobile-First Frame */}
      <div className="w-full max-w-md min-h-screen bg-[#090D16] flex flex-col relative px-4 pt-3 border-x border-slate-900 shadow-2xl">
        {/* App Top Bar */}
        <header className="flex items-center justify-between py-2 border-b border-slate-900 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
              <Shield className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-sm font-black tracking-tight text-white block">
                {profile.disguiseTitle ? "Daily Habits" : "UNBROKEN"}
              </span>
              <span
                className="text-[9px] font-semibold tracking-wider text-emerald-400 block -mt-0.5"
              >
                {profile.disguiseTitle
                  ? "Habit & Wellness Tracker"
                  : "Clear Eyes, Clean Mind."}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {profile.pinCode && (
              <button
                onClick={() => setIsUnlocked(false)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                title="Lock App with PIN"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
              title={`Signed in as ${currentUser.email}. Click to sign out.`}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>

            <span className="text-[10px] font-bold uppercase bg-slate-900 border border-slate-800 text-slate-400 px-2 py-1 rounded-md">
              {profile.addictionTier.split("—")[0].trim()}
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
            />
          )}

          {currentTab === "analytics" && (
            <AnalyticsDashboard profile={profile} dailyLogs={dailyLogs} />
          )}

          {currentTab === "scripture" && (
            <ScriptureVault
              savedVerses={savedVerses}
              onSaveVerseWithReflection={handleSaveVerseWithReflection}
              onRemoveSavedVerse={handleRemoveSavedVerse}
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
            />
          )}
        </div>

        {/* Fixed Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenSOS={() => setShowSOSModal(true)}
        />

        {/* Modals */}
        <UrgeRescueModal
          isOpen={showSOSModal}
          onClose={() => setShowSOSModal(false)}
          onVictory={handleVictorySOS}
        />

        <DailyCheckInModal
          isOpen={showCheckInModal}
          onClose={() => setShowCheckInModal(false)}
          onSubmitLog={handleSubmitDailyLog}
          onOpenRelapseGraceModal={() => setShowRelapseGraceModal(true)}
        />

        <GraceRelapseModal
          isOpen={showRelapseGraceModal}
          onClose={() => setShowRelapseGraceModal(false)}
          onConfirmReset={handleRelapseReset}
        />
      </div>
    </main>
  );
}
