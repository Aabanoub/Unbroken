import { UserProfile, DailyLog, SavedVerse, AuthUser, Language, ThemeMode } from "@/types";
import { supabase, isSupabaseConfigured } from "./supabase";
import { notifyDataChanged } from "./syncManager";

const STORAGE_KEYS = {
  CURRENT_USER: "unbroken_active_user_session_v1",
  USERS_REGISTRY: "unbroken_users_registry_v1",
  GLOBAL_LANG: "unbroken_global_lang_v1",
  GLOBAL_THEME: "unbroken_global_theme_v1",
  PIN_UNLOCKED: (userId: string) => `unbroken_session_unlocked_${userId}`,
  PROFILE: (userId: string) => `unbroken_user_profile_${userId}`,
  LOGS: (userId: string) => `unbroken_daily_logs_${userId}`,
  SAVED_VERSES: (userId: string) => `unbroken_saved_verses_${userId}`,
};

export interface LocalUserAccount {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  createdAt: string;
}

export function generateSecureUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Default Demo User for instant preview
export const DEMO_USER: AuthUser = {
  id: "demo-teen-user-01",
  email: "nathaniel@unbroken.app",
  displayName: "Nathaniel",
  isGuest: true,
};

export const DEMO_PROFILE: UserProfile = {
  id: "demo-teen-user-01",
  displayName: "Nathaniel",
  onboardingCompleted: true,
  onboardingScore: 17,
  currentAddictionIndex: 11.2,
  addictionTier: "Level 2 — Moderate Compulsive Dependency",
  goalDays: 40,
  initialDopamineSensitivity: 45,
  streakStartTimestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000).toISOString(),
  longestStreakDays: 14,
  urgesDefeatedCount: 9,
  pinCode: null,
  disguiseTitle: false,
  language: "en",
  theme: "dark",
  createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
};

export const DEMO_SAVED_VERSES: SavedVerse[] = [
  {
    id: "v-demo-1",
    userId: "demo-teen-user-01",
    reference: "1 Corinthians 10:13",
    verseText: "No temptation has overtaken you except such as is common to man; but God is faithful, who will not allow you to be tempted beyond what you are able, but with the temptation will also make the way of escape, that you may be able to bear it.",
    personalReflection: "Memorized this for late nights when my phone is in bed. God always has an exit door open.",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "v-demo-2",
    userId: "demo-teen-user-01",
    reference: "Micah 7:8",
    verseText: "Do not rejoice over me, my enemy; when I fall, I will arise; when I sit in darkness, the LORD will be a light to me.",
    personalReflection: "Heard this after my relapse two weeks ago. The devil wanted me to quit, but Jesus helped me arise.",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "v-demo-3",
    userId: "demo-teen-user-01",
    reference: "2 Timothy 1:7",
    verseText: "For God has not given us a spirit of fear, but of power and of love and of a sound mind.",
    personalReflection: "A sound mind means balanced dopamine and peace. Claiming this during study sessions.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export function generateDemoDailyLogs(): DailyLog[] {
  const logs: DailyLog[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split("T")[0];

    if (i === 15) {
      logs.push({
        id: `log-${i}`,
        userId: "demo-teen-user-01",
        logDate: dateStr,
        status: "relapse",
        urgeIntensity: 9,
        triggers: ["Late Night Phone", "Bored", "Tired"],
        timeOfDay: "Late Night 11PM-3AM",
        journalNote: "Browsed social media in bed past midnight, felt lonely and tired. Confessed immediately and prayed Micah 7:8.",
        createdAt: d.toISOString()
      });
    } else if (i === 12 || i === 8 || i === 4 || i === 1) {
      logs.push({
        id: `log-${i}`,
        userId: "demo-teen-user-01",
        logDate: dateStr,
        status: "urge_defeated",
        urgeIntensity: 7 + (i % 3),
        triggers: i % 2 === 0 ? ["Bored", "Stressed"] : ["Late Night Phone", "Lonely"],
        timeOfDay: i % 2 === 0 ? "Evening" : "Late Night 11PM-3AM",
        journalNote: "Used the SOS Urge Rescue button! Did box breathing and 20 pushups. The urge dissolved in 10 minutes.",
        createdAt: d.toISOString()
      });
    } else {
      const intensities = [2, 3, 1, 4, 2, 1, 3, 2];
      logs.push({
        id: `log-${i}`,
        userId: "demo-teen-user-01",
        logDate: dateStr,
        status: "clean",
        urgeIntensity: intensities[i % intensities.length],
        triggers: i % 3 === 0 ? ["Tired"] : [],
        timeOfDay: "Morning",
        journalNote: "Felt clear-headed, read daily Scripture and focused on school work.",
        createdAt: d.toISOString()
      });
    }
  }

  return logs;
}

// -----------------------------------------------------------------------------
// USER SESSION & AUTHENTICATION REGISTRY
// -----------------------------------------------------------------------------

export function getCurrentSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCurrentSession(user: AuthUser | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (err) {
    console.error("Failed to save current session:", err);
  }
}

export function getLocalAccountsRegistry(): LocalUserAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS_REGISTRY);
    if (!raw) {
      // Seed default demo user in registry
      const defaultAccounts: LocalUserAccount[] = [
        {
          id: DEMO_USER.id,
          email: DEMO_USER.email,
          passwordHash: "pass123",
          displayName: DEMO_USER.displayName,
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(STORAGE_KEYS.USERS_REGISTRY, JSON.stringify(defaultAccounts));
      return defaultAccounts;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function authenticateUser(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  let supabaseAuthError: string | null = null;

  // 1. Try Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (!error && data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          displayName: data.user.user_metadata?.display_name || cleanEmail.split("@")[0],
          isGuest: false,
        };
        saveCurrentSession(authUser);
        return { success: true, user: authUser };
      } else if (error) {
        supabaseAuthError = error.message;
        console.warn("Supabase auth response:", error.message);
      }
    } catch (err: any) {
      supabaseAuthError = err.message;
      console.warn("Supabase auth error, falling back to local registry:", err);
    }
  }

  // 2. Local accounts fallback
  const accounts = getLocalAccountsRegistry();
  const found = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

  if (found) {
    if (found.passwordHash !== pass) {
      return { success: false, error: "Incorrect password. Please try again." };
    }
    const authUser: AuthUser = {
      id: found.id,
      email: found.email,
      displayName: found.displayName,
      isGuest: found.id === DEMO_USER.id,
    };
    saveCurrentSession(authUser);
    return { success: true, user: authUser };
  }

  if (supabaseAuthError) {
    return { success: false, error: supabaseAuthError };
  }

  return { success: false, error: "No account found with this email. Please sign up." };
}

export async function registerNewUser(
  email: string,
  pass: string,
  displayName: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = displayName.trim() || cleanEmail.split("@")[0];

  // 1. Try Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: pass,
        options: {
          data: { display_name: cleanName },
        },
      });

      if (!error && data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          displayName: cleanName,
          isGuest: false,
        };

        // Also save to local accounts registry for instant resilience
        const accounts = getLocalAccountsRegistry();
        const existingIdx = accounts.findIndex((a) => a.email.toLowerCase() === cleanEmail);
        const accountEntry: LocalUserAccount = {
          id: data.user.id,
          email: cleanEmail,
          passwordHash: pass,
          displayName: cleanName,
          createdAt: new Date().toISOString(),
        };
        if (existingIdx >= 0) {
          accounts[existingIdx] = accountEntry;
        } else {
          accounts.push(accountEntry);
        }
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.USERS_REGISTRY, JSON.stringify(accounts));
        }

        // Create initial profile for this user in Supabase and LocalStorage
        const initialProfile: UserProfile = {
          id: data.user.id,
          displayName: cleanName,
          onboardingCompleted: false,
          onboardingScore: 0,
          currentAddictionIndex: 0,
          addictionTier: "Level 1 — Mild Habitual Loop",
          goalDays: 21,
          initialDopamineSensitivity: 70,
          streakStartTimestamp: new Date().toISOString(),
          longestStreakDays: 0,
          urgesDefeatedCount: 0,
          pinCode: null,
          disguiseTitle: false,
          language: "en",
          theme: "dark",
          createdAt: new Date().toISOString(),
        };

        saveUserProfile(data.user.id, initialProfile);
        saveCurrentSession(authUser);
        return { success: true, user: authUser };
      } else if (error) {
        console.warn("Supabase signup returned error, falling back to local account:", error.message);
      }
    } catch (err: any) {
      console.warn("Supabase signup error, falling back to local registry:", err);
    }
  }

  // 2. Local accounts fallback (or when Supabase email rate limit occurs)
  const accounts = getLocalAccountsRegistry();
  const existingAccount = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
  if (existingAccount) {
    return { success: false, error: "An account with this email already exists. Please log in." };
  }

  const newId = generateSecureUuid();
  const newAccount: LocalUserAccount = {
    id: newId,
    email: cleanEmail,
    passwordHash: pass,
    displayName: cleanName,
    createdAt: new Date().toISOString(),
  };

  accounts.push(newAccount);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.USERS_REGISTRY, JSON.stringify(accounts));
  }

  const authUser: AuthUser = {
    id: newId,
    email: cleanEmail,
    displayName: cleanName,
    isGuest: false,
  };

  // Create clean initial profile for this new user
  const initialProfile: UserProfile = {
    id: newId,
    displayName: cleanName,
    onboardingCompleted: false, // Forces 8-question scientific assessment
    onboardingScore: 0,
    currentAddictionIndex: 0,
    addictionTier: "Level 1 — Mild Habitual Loop",
    goalDays: 21,
    initialDopamineSensitivity: 70,
    streakStartTimestamp: new Date().toISOString(),
    longestStreakDays: 0,
    urgesDefeatedCount: 0,
    pinCode: null,
    disguiseTitle: false,
    language: "en",
    theme: "dark",
    createdAt: new Date().toISOString(),
  };

  saveUserProfile(newId, initialProfile);
  saveCurrentSession(authUser);

  return { success: true, user: authUser };
}

export function loginAsDemoGuest(): AuthUser {
  saveCurrentSession(DEMO_USER);
  // Ensure demo profile and logs exist
  const existing = getUserProfile(DEMO_USER.id);
  if (!existing || existing.id !== DEMO_USER.id) {
    saveUserProfile(DEMO_USER.id, DEMO_PROFILE);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.LOGS(DEMO_USER.id), JSON.stringify(generateDemoDailyLogs()));
      localStorage.setItem(STORAGE_KEYS.SAVED_VERSES(DEMO_USER.id), JSON.stringify(DEMO_SAVED_VERSES));
    }
  }
  return DEMO_USER;
}

export async function logoutUser(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // ignore
    }
  }
  saveCurrentSession(null);
}

// -----------------------------------------------------------------------------
// USER-ISOLATED DATA ACCESS (EVERY USER HAS HIS OWN DATA)
// -----------------------------------------------------------------------------

export function getUserProfile(userId: string): UserProfile {
  if (typeof window === "undefined") {
    return userId === DEMO_USER.id ? DEMO_PROFILE : {
      id: userId,
      displayName: "Disciple",
      onboardingCompleted: false,
      onboardingScore: 0,
      currentAddictionIndex: 0,
      addictionTier: "Level 1 — Mild Habitual Loop",
      goalDays: 21,
      initialDopamineSensitivity: 70,
      streakStartTimestamp: new Date().toISOString(),
      longestStreakDays: 0,
      urgesDefeatedCount: 0,
      pinCode: null,
      disguiseTitle: false,
      createdAt: new Date().toISOString(),
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE(userId));
    if (raw) return JSON.parse(raw);

    // If it's the demo user, initialize with demo profile
    if (userId === DEMO_USER.id) {
      localStorage.setItem(STORAGE_KEYS.PROFILE(userId), JSON.stringify(DEMO_PROFILE));
      return DEMO_PROFILE;
    }

    // Default clean profile for new user
    const fresh: UserProfile = {
      id: userId,
      displayName: "Disciple",
      onboardingCompleted: false,
      onboardingScore: 0,
      currentAddictionIndex: 0,
      addictionTier: "Level 1 — Mild Habitual Loop",
      goalDays: 21,
      initialDopamineSensitivity: 70,
      streakStartTimestamp: new Date().toISOString(),
      longestStreakDays: 0,
      urgesDefeatedCount: 0,
      pinCode: null,
      disguiseTitle: false,
      language: "en",
      theme: "dark",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.PROFILE(userId), JSON.stringify(fresh));
    return fresh;
  } catch {
    return DEMO_PROFILE;
  }
}

export function saveUserProfile(userId: string, updates: Partial<UserProfile>): UserProfile {
  const current = getUserProfile(userId);
  const updated: UserProfile = { ...current, ...updates, id: userId };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE(userId), JSON.stringify(updated));
    } catch (err) {
      console.error("Local storage error:", err);
    }
  }

  // Supabase sync if connected
  if (isSupabaseConfigured && supabase) {
    supabase
      .from("profiles")
      .upsert({
        id: updated.id,
        display_name: updated.displayName,
        onboarding_score: updated.onboardingScore,
        current_addiction_index: updated.currentAddictionIndex,
        addiction_tier: updated.addictionTier,
        goal_days: updated.goalDays,
        streak_start_timestamp: updated.streakStartTimestamp,
        longest_streak_days: updated.longestStreakDays,
        urges_defeated_count: updated.urgesDefeatedCount,
        pin_code: updated.pinCode,
        disguise_title: updated.disguiseTitle,
      })
      .then(({ error }) => {
        if (error) console.warn("Supabase profile sync warning:", error.message);
      });
  }

  notifyDataChanged();
  return updated;
}

export function getUserDailyLogs(userId: string): DailyLog[] {
  if (typeof window === "undefined") {
    return userId === DEMO_USER.id ? generateDemoDailyLogs() : [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS(userId));
    if (raw) return JSON.parse(raw);

    if (userId === DEMO_USER.id) {
      const demo = generateDemoDailyLogs();
      localStorage.setItem(STORAGE_KEYS.LOGS(userId), JSON.stringify(demo));
      return demo;
    }

    return [];
  } catch {
    return [];
  }
}

export function saveUserDailyLog(
  userId: string,
  newLog: Omit<DailyLog, "id" | "createdAt" | "userId">
): DailyLog {
  const logs = getUserDailyLogs(userId);
  const created: DailyLog = {
    ...newLog,
    userId,
    id: generateSecureUuid(),
    createdAt: new Date().toISOString()
  };

  const existingIdx = logs.findIndex((l) => l.logDate === newLog.logDate);
  if (existingIdx >= 0) {
    logs[existingIdx] = created;
  } else {
    logs.push(created);
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS(userId), JSON.stringify(logs));
    } catch (err) {
      console.error("Local storage error:", err);
    }
  }

  if (isSupabaseConfigured && supabase) {
    supabase
      .from("daily_logs")
      .upsert({
        id: created.id,
        user_id: created.userId,
        log_date: created.logDate,
        status: created.status,
        urge_intensity: created.urgeIntensity,
        triggers: created.triggers,
        time_of_day: created.timeOfDay,
        journal_note: created.journalNote,
      })
      .then(({ error }) => {
        if (error) console.warn("Supabase daily log sync warning:", error.message);
      });
  }

  notifyDataChanged();
  return created;
}

export function getUserSavedVerses(userId: string): SavedVerse[] {
  if (typeof window === "undefined") {
    return userId === DEMO_USER.id ? DEMO_SAVED_VERSES : [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_VERSES(userId));
    if (raw) return JSON.parse(raw);

    if (userId === DEMO_USER.id) {
      localStorage.setItem(STORAGE_KEYS.SAVED_VERSES(userId), JSON.stringify(DEMO_SAVED_VERSES));
      return DEMO_SAVED_VERSES;
    }

    return [];
  } catch {
    return [];
  }
}

export function saveUserVerse(
  userId: string,
  verse: Omit<SavedVerse, "id" | "createdAt" | "userId">
): SavedVerse {
  const verses = getUserSavedVerses(userId);
  const created: SavedVerse = {
    ...verse,
    userId,
    id: generateSecureUuid(),
    createdAt: new Date().toISOString()
  };

  verses.unshift(created);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_VERSES(userId), JSON.stringify(verses));
    } catch (err) {
      console.error("Local storage error:", err);
    }
  }

  if (isSupabaseConfigured && supabase) {
    supabase
      .from("saved_verses")
      .upsert({
        id: created.id,
        user_id: created.userId,
        reference: created.reference,
        verse_text: created.verseText,
        personal_reflection: created.personalReflection,
      })
      .then(({ error }) => {
        if (error) console.warn("Supabase verse sync warning:", error.message);
      });
  }

  notifyDataChanged();
  return created;
}

export function removeUserVerse(userId: string, id: string): void {
  const verses = getUserSavedVerses(userId).filter((v) => v.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_VERSES(userId), JSON.stringify(verses));
    } catch (err) {
      console.error("Local storage error:", err);
    }
  }

  if (isSupabaseConfigured && supabase) {
    supabase
      .from("saved_verses")
      .delete()
      .eq("user_id", userId)
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.warn("Supabase remove verse warning:", error.message);
      });
  }

  notifyDataChanged();
}

// -----------------------------------------------------------------------------
// PUSH LOCAL DATA TO SUPABASE (FORCE MANUAL OR INITIAL SYNC)
// -----------------------------------------------------------------------------
export async function pushLocalDataToSupabase(userId: string): Promise<{
  success: boolean;
  profileSynced: boolean;
  logsCount: number;
  versesCount: number;
  error?: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      profileSynced: false,
      logsCount: 0,
      versesCount: 0,
      error: "Supabase is not configured in .env.local",
    };
  }

  try {
    const profile = getUserProfile(userId);
    const logs = getUserDailyLogs(userId);
    const verses = getUserSavedVerses(userId);

    // 1. Sync Profile
    const { error: pError } = await supabase.from("profiles").upsert({
      id: profile.id,
      display_name: profile.displayName,
      onboarding_score: profile.onboardingScore,
      current_addiction_index: profile.currentAddictionIndex,
      addiction_tier: profile.addictionTier,
      goal_days: profile.goalDays,
      streak_start_timestamp: profile.streakStartTimestamp,
      longest_streak_days: profile.longestStreakDays,
      urges_defeated_count: profile.urgesDefeatedCount,
      pin_code: profile.pinCode,
      disguise_title: profile.disguiseTitle,
    });

    if (pError) {
      return {
        success: false,
        profileSynced: false,
        logsCount: 0,
        versesCount: 0,
        error: `Profiles table rejected sync: ${pError.message} (${pError.code})`,
      };
    }

    // 2. Sync Daily Logs
    let syncedLogs = 0;
    for (const log of logs) {
      const { error: lError } = await supabase.from("daily_logs").upsert({
        id: log.id,
        user_id: log.userId,
        log_date: log.logDate,
        status: log.status,
        urge_intensity: log.urgeIntensity,
        triggers: log.triggers,
        time_of_day: log.timeOfDay,
        journal_note: log.journalNote,
      });
      if (lError) {
        return {
          success: false,
          profileSynced: true,
          logsCount: syncedLogs,
          versesCount: 0,
          error: `Daily logs table rejected sync: ${lError.message} (${lError.code})`,
        };
      }
      syncedLogs++;
    }

    // 3. Sync Saved Verses
    let syncedVerses = 0;
    for (const v of verses) {
      const { error: vError } = await supabase.from("saved_verses").upsert({
        id: v.id,
        user_id: v.userId,
        reference: v.reference,
        verse_text: v.verseText,
        personal_reflection: v.personalReflection,
      });
      if (vError) {
        return {
          success: false,
          profileSynced: true,
          logsCount: syncedLogs,
          versesCount: syncedVerses,
          error: `Saved verses table rejected sync: ${vError.message} (${vError.code})`,
        };
      }
      syncedVerses++;
    }

    return {
      success: true,
      profileSynced: true,
      logsCount: syncedLogs,
      versesCount: syncedVerses,
    };
  } catch (err: any) {
    return {
      success: false,
      profileSynced: false,
      logsCount: 0,
      versesCount: 0,
      error: err.message || "Failed to sync data with Supabase.",
    };
  }
}

// -----------------------------------------------------------------------------
// CLOUD DATA REHYDRATION (CROSS-DEVICE SYNC)
// -----------------------------------------------------------------------------
export async function syncUserDataFromCloud(userId: string): Promise<{
  profile: UserProfile;
  dailyLogs: DailyLog[];
  savedVerses: SavedVerse[];
}> {
  // Always get initial local data first
  let profile = getUserProfile(userId);
  let dailyLogs = getUserDailyLogs(userId);
  let savedVerses = getUserSavedVerses(userId);

  if (!isSupabaseConfigured || !supabase || userId === DEMO_USER.id) {
    return { profile, dailyLogs, savedVerses };
  }

  try {
    // 1. Fetch Profile from Supabase
    const { data: pData, error: pError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!pError && pData) {
      profile = {
        id: pData.id,
        displayName: pData.display_name || profile.displayName || "Disciple",
        onboardingCompleted: (pData.onboarding_score > 0) || (pData.goal_days > 0),
        onboardingScore: pData.onboarding_score || 0,
        currentAddictionIndex: Number(pData.current_addiction_index || 0),
        addictionTier: pData.addiction_tier || profile.addictionTier,
        goalDays: pData.goal_days || 21,
        initialDopamineSensitivity: profile.initialDopamineSensitivity || 70,
        streakStartTimestamp: pData.streak_start_timestamp || profile.streakStartTimestamp,
        longestStreakDays: pData.longest_streak_days || 0,
        urgesDefeatedCount: pData.urges_defeated_count || 0,
        pinCode: pData.pin_code || null,
        disguiseTitle: Boolean(pData.disguise_title),
        language: profile.language || "en",
        theme: profile.theme || "dark",
        createdAt: pData.created_at || profile.createdAt,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.PROFILE(userId), JSON.stringify(profile));
      }
    }

    // 2. Fetch Daily Logs from Supabase
    const { data: lData, error: lError } = await supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", userId)
      .order("log_date", { ascending: true });

    if (!lError && lData && lData.length > 0) {
      dailyLogs = lData.map((l: any) => ({
        id: l.id,
        userId: l.user_id,
        logDate: l.log_date,
        status: l.status,
        urgeIntensity: l.urge_intensity,
        triggers: l.triggers || [],
        timeOfDay: l.time_of_day || "Evening",
        journalNote: l.journal_note || "",
        createdAt: l.created_at,
      }));

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.LOGS(userId), JSON.stringify(dailyLogs));
      }
    }

    // 3. Fetch Saved Verses from Supabase
    const { data: vData, error: vError } = await supabase
      .from("saved_verses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!vError && vData && vData.length > 0) {
      savedVerses = vData.map((v: any) => ({
        id: v.id,
        userId: v.user_id,
        reference: v.reference,
        verseText: v.verse_text,
        personalReflection: v.personal_reflection || "",
        createdAt: v.created_at,
      }));

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.SAVED_VERSES(userId), JSON.stringify(savedVerses));
      }
    }
  } catch (err) {
    console.warn("Supabase cross-device sync warning:", err);
  }

  return { profile, dailyLogs, savedVerses };
}

// -----------------------------------------------------------------------------
// BACKWARDS-COMPATIBLE WRAPPERS (Uses current session or DEMO)
// -----------------------------------------------------------------------------

function getActiveUserId(): string {
  const session = getCurrentSession();
  return session?.id || DEMO_USER.id;
}

export function getLocalProfile(): UserProfile {
  return getUserProfile(getActiveUserId());
}

export function saveLocalProfile(profile: Partial<UserProfile>): UserProfile {
  return saveUserProfile(getActiveUserId(), profile);
}

export function getLocalDailyLogs(): DailyLog[] {
  return getUserDailyLogs(getActiveUserId());
}

export function saveLocalDailyLog(newLog: Omit<DailyLog, "id" | "createdAt" | "userId">): DailyLog {
  return saveUserDailyLog(getActiveUserId(), newLog);
}

export function getLocalSavedVerses(): SavedVerse[] {
  return getUserSavedVerses(getActiveUserId());
}

export function saveLocalVerse(verse: Omit<SavedVerse, "id" | "createdAt" | "userId">): SavedVerse {
  return saveUserVerse(getActiveUserId(), verse);
}

export function removeLocalVerse(id: string): void {
  removeUserVerse(getActiveUserId(), id);
}

// -----------------------------------------------------------------------------
// METRICS HELPERS
// -----------------------------------------------------------------------------

export function calculate30DayVictoryRate(logs: DailyLog[]): number {
  if (!logs || logs.length === 0) return 100;
  const last30 = logs.slice(-30);
  const cleanOrVictorious = last30.filter((l) => l.status === "clean" || l.status === "urge_defeated").length;
  const rate = Math.round((cleanOrVictorious / Math.max(last30.length, 1)) * 100);
  return Math.min(Math.max(rate, 0), 100);
}

export function calculateAddictionSeverityIndex(
  baselineScore: number,
  streakDays: number,
  urgesDefeated: number
): number {
  const dayReduction = Math.min(streakDays * 0.18, baselineScore * 0.5);
  const urgeReduction = Math.min(urgesDefeated * 0.35, baselineScore * 0.3);
  const current = Math.max(baselineScore - dayReduction - urgeReduction, 1.2);
  return Number(current.toFixed(1));
}

export function resetAppData(type: "fresh" | "demo"): void {
  const userId = getActiveUserId();
  if (typeof window === "undefined") return;

  if (type === "fresh") {
    const freshProfile: UserProfile = {
      id: userId,
      displayName: "Disciple",
      onboardingCompleted: false,
      onboardingScore: 0,
      currentAddictionIndex: 0,
      addictionTier: "Level 1 — Mild Habitual Loop",
      goalDays: 21,
      initialDopamineSensitivity: 70,
      streakStartTimestamp: new Date().toISOString(),
      longestStreakDays: 0,
      urgesDefeatedCount: 0,
      pinCode: null,
      disguiseTitle: false,
      language: "en",
      theme: "dark",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.PROFILE(userId), JSON.stringify(freshProfile));
    localStorage.setItem(STORAGE_KEYS.LOGS(userId), JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SAVED_VERSES(userId), JSON.stringify([]));
  } else {
    localStorage.setItem(STORAGE_KEYS.PROFILE(userId), JSON.stringify(DEMO_PROFILE));
    localStorage.setItem(STORAGE_KEYS.LOGS(userId), JSON.stringify(generateDemoDailyLogs()));
    localStorage.setItem(STORAGE_KEYS.SAVED_VERSES(userId), JSON.stringify(DEMO_SAVED_VERSES));
  }
}

export function getGlobalLanguage(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.GLOBAL_LANG);
    if (saved === "ar" || saved === "en") return saved;
    return "en";
  } catch {
    return "en";
  }
}

export function setGlobalLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.GLOBAL_LANG, lang);
  } catch (err) {
    console.error("Failed to save global language:", err);
  }
}

export function getGlobalTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.GLOBAL_THEME);
    if (saved === "light" || saved === "dark") return saved;
    return "dark";
  } catch {
    return "dark";
  }
}

export function setGlobalTheme(theme: ThemeMode): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.GLOBAL_THEME, theme);
  } catch (err) {
    console.error("Failed to save global theme:", err);
  }
}
