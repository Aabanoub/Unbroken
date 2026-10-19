// ==============================================================================
// UNBROKEN (Unbroken Daily) Zero-Delay Optimistic Storage Engine
// 0ms Local Write + Non-Blocking Background Supabase Cloud Upsert
// Multi-Device Realtime Sync & Offline Resilient Queue
// ==============================================================================

import { UserProfile, DailyLog, SavedVerse, AuthUser, Language, ThemeMode, LogStatus, TimeOfDayOption } from "@/types";
import { getSupabaseClient, isSupabaseConfigured } from "./supabase";

export const STORAGE_KEYS = {
  CURRENT_USER: "unbroken_active_user_session_v2",
  USERS_REGISTRY: "unbroken_users_registry_v2",
  GLOBAL_LANG: "unbroken_global_lang_v2",
  GLOBAL_THEME: "unbroken_global_theme_v2",
  SYNC_QUEUE: "unbroken_sync_queue_v2",
  LAST_CLOUD_SYNC: (userId: string) => `unbroken_last_sync_${userId}`,
  PROFILE: (userId: string) => `unbroken_profile_${userId}`,
  LOGS: (userId: string) => `unbroken_logs_${userId}`,
  SAVED_VERSES: (userId: string) => `unbroken_verses_${userId}`,
};

export interface SyncQueueItem {
  id: string;
  table: "profiles" | "daily_logs" | "saved_verses";
  action: "upsert" | "delete";
  payload: any;
  updated_at: string;
  userId: string;
}

// ------------------------------------------------------------------------------
// UUID GENERATOR (RFC4122 Standard)
// ------------------------------------------------------------------------------
export function generateUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ------------------------------------------------------------------------------
// DEMO SEED DATA
// ------------------------------------------------------------------------------
export const DEMO_USER: AuthUser = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "disciple@unbroken.app",
  displayName: "Nathaniel",
  isGuest: true,
};

export const DEMO_PROFILE: UserProfile = {
  id: "00000000-0000-0000-0000-000000000001",
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
    id: "00000000-0000-0000-0000-000000000101",
    userId: "00000000-0000-0000-0000-000000000001",
    reference: "1 Corinthians 10:13",
    verseText: "No temptation has overtaken you except such as is common to man; but God is faithful, who will not allow you to be tempted beyond what you are able, but with the temptation will also make the way of escape, that you may be able to bear it.",
    personalReflection: "Memorized this for late nights when my phone is in bed. God always has an exit door open.",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "00000000-0000-0000-0000-000000000102",
    userId: "00000000-0000-0000-0000-000000000001",
    reference: "Micah 7:8",
    verseText: "Do not rejoice over me, my enemy; when I fall, I will arise; when I sit in darkness, the LORD will be a light to me.",
    personalReflection: "Heard this after my relapse two weeks ago. The devil wanted me to quit, but Jesus helped me arise.",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "00000000-0000-0000-0000-000000000103",
    userId: "00000000-0000-0000-0000-000000000001",
    reference: "2 Timothy 1:7",
    verseText: "For God has not given us a spirit of fear, but of power and of love and of a sound mind.",
    personalReflection: "A sound mind means balanced dopamine and peace. Claiming this during study sessions.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function generateDemoDailyLogs(): DailyLog[] {
  const logs: DailyLog[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split("T")[0];

    if (i === 15) {
      logs.push({
        id: `00000000-0000-0000-0000-${String(1000 + i).padStart(12, "0")}`,
        userId: "00000000-0000-0000-0000-000000000001",
        logDate: dateStr,
        status: "relapse",
        urgeIntensity: 9,
        triggers: ["Late Night Phone", "Bored", "Tired"],
        timeOfDay: "Late Night 11PM-3AM",
        journalNote: "Browsed social media in bed past midnight. Prayed Micah 7:8 and got back up.",
        createdAt: d.toISOString(),
      });
    } else if (i === 12 || i === 8 || i === 4 || i === 1) {
      logs.push({
        id: `00000000-0000-0000-0000-${String(1000 + i).padStart(12, "0")}`,
        userId: "00000000-0000-0000-0000-000000000001",
        logDate: dateStr,
        status: "urge_defeated",
        urgeIntensity: 8,
        triggers: ["Tired", "Stressed"],
        timeOfDay: "Evening",
        journalNote: "Did box breathing and pushups from SOS Protocol. Urge vanished after 15 mins.",
        createdAt: d.toISOString(),
      });
    } else {
      logs.push({
        id: `00000000-0000-0000-0000-${String(1000 + i).padStart(12, "0")}`,
        userId: "00000000-0000-0000-0000-000000000001",
        logDate: dateStr,
        status: "clean",
        urgeIntensity: 0,
        triggers: [],
        timeOfDay: "Evening",
        journalNote: "Walked with God in purity today.",
        createdAt: d.toISOString(),
      });
    }
  }

  return logs;
}

// ------------------------------------------------------------------------------
// DATABASE <-> FRONTEND BIDIRECTIONAL MAPPERS
// ------------------------------------------------------------------------------

export function dbProfileToUserProfile(db: any): UserProfile {
  const currentStreak = db.current_streak !== undefined 
    ? db.current_streak 
    : calculateStreakFromDate(db.streak_start_date || db.created_at);

  const assessmentScore = db.assessment_score || 0;
  const longestStreak = db.longest_streak || 0;
  const urgesDefeated = db.urges_defeated_count || 0;

  let tier: UserProfile["addictionTier"] = "Level 1 — Mild Habitual Loop";
  if (assessmentScore >= 24) {
    tier = "Level 3 — High Neurological Dependency";
  } else if (assessmentScore >= 13) {
    tier = "Level 2 — Moderate Compulsive Dependency";
  }

  return {
    id: db.id,
    displayName: db.display_name || "Disciple",
    onboardingCompleted: (assessmentScore > 0) || (db.roadmap_days > 0),
    onboardingScore: assessmentScore,
    currentAddictionIndex: calculateAddictionSeverityIndex(assessmentScore, currentStreak, urgesDefeated),
    addictionTier: tier,
    goalDays: db.roadmap_days || 21,
    initialDopamineSensitivity: assessmentScore >= 24 ? 20 : assessmentScore >= 13 ? 45 : 70,
    streakStartTimestamp: db.streak_start_date || db.created_at || new Date().toISOString(),
    longestStreakDays: longestStreak,
    urgesDefeatedCount: urgesDefeated,
    pinCode: db.pin_code || null,
    disguiseTitle: Boolean(db.disguise_title),
    language: (db.language as Language) || "en",
    theme: (db.theme as ThemeMode) || "dark",
    createdAt: db.created_at || new Date().toISOString(),
  };
}

export function userProfileToDbProfile(p: Partial<UserProfile>, email?: string) {
  const currentStreak = p.streakStartTimestamp 
    ? calculateStreakFromDate(p.streakStartTimestamp) 
    : 0;

  return {
    id: p.id,
    email: email || undefined,
    display_name: p.displayName,
    pin_code: p.pinCode,
    assessment_score: p.onboardingScore,
    roadmap_days: p.goalDays,
    streak_start_date: p.streakStartTimestamp,
    current_streak: currentStreak,
    longest_streak: p.longestStreakDays,
    disguise_title: p.disguiseTitle,
    language: p.language,
    theme: p.theme,
    updated_at: new Date().toISOString(),
  };
}

export function dbLogToDailyLog(db: any): DailyLog {
  let status: LogStatus = "clean";
  if (!db.victory) {
    status = "relapse";
  } else if (db.urge_level && db.urge_level > 0) {
    status = "urge_defeated";
  }

  let timeOfDay: TimeOfDayOption = "Evening";
  if (db.high_risk_hour !== undefined && db.high_risk_hour !== null) {
    if (db.high_risk_hour >= 23 || db.high_risk_hour < 4) {
      timeOfDay = "Late Night 11PM-3AM";
    } else if (db.high_risk_hour < 12) {
      timeOfDay = "Morning";
    } else if (db.high_risk_hour < 17) {
      timeOfDay = "Afternoon";
    } else {
      timeOfDay = "Evening";
    }
  }

  return {
    id: db.id,
    userId: db.user_id,
    logDate: db.log_date,
    status,
    urgeIntensity: db.urge_level || 0,
    triggers: db.halt_triggers || [],
    timeOfDay,
    journalNote: db.notes || "",
    createdAt: db.created_at || db.updated_at || new Date().toISOString(),
  };
}

export function dailyLogToDbLog(l: Partial<DailyLog>) {
  const victory = l.status !== "relapse";
  let highRiskHour = 22;

  if (l.timeOfDay === "Morning") highRiskHour = 9;
  else if (l.timeOfDay === "Afternoon") highRiskHour = 15;
  else if (l.timeOfDay === "Evening") highRiskHour = 21;
  else if (l.timeOfDay === "Late Night 11PM-3AM") highRiskHour = 1;

  return {
    id: l.id || generateUuid(),
    user_id: l.userId,
    log_date: l.logDate,
    victory,
    urge_level: l.urgeIntensity || 0,
    halt_triggers: l.triggers || [],
    high_risk_hour: highRiskHour,
    notes: l.journalNote || "",
    updated_at: new Date().toISOString(),
  };
}

export function dbVerseToSavedVerse(db: any): SavedVerse {
  return {
    id: db.id,
    userId: db.user_id,
    reference: db.reference,
    verseText: db.text_en || "",
    personalReflection: db.personal_reflection || "",
    createdAt: db.created_at || new Date().toISOString(),
  };
}

export function savedVerseToDbVerse(v: Partial<SavedVerse>) {
  return {
    id: v.id || generateUuid(),
    user_id: v.userId,
    reference: v.reference,
    text_en: v.verseText,
    text_ar: "",
    personal_reflection: v.personalReflection || "",
    created_at: v.createdAt || new Date().toISOString(),
  };
}

// ------------------------------------------------------------------------------
// OFFLINE QUEUE MANAGER
// ------------------------------------------------------------------------------

export function getSyncQueue(): SyncQueueItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function enqueueSyncMutation(item: Omit<SyncQueueItem, "id" | "updated_at">): void {
  if (typeof window === "undefined") return;
  try {
    const queue = getSyncQueue();
    // De-duplicate if same table & id
    const filtered = queue.filter(
      (q) => !(q.table === item.table && q.payload?.id === item.payload?.id && q.action === item.action)
    );
    filtered.push({
      ...item,
      id: generateUuid(),
      updated_at: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to enqueue sync mutation:", err);
  }
}

export async function flushSyncQueue(): Promise<{ processed: number; failed: number }> {
  if (typeof window === "undefined" || !navigator.onLine) {
    return { processed: 0, failed: 0 };
  }

  const supabase = getSupabaseClient();
  if (!supabase) return { processed: 0, failed: 0 };

  const queue = getSyncQueue();
  if (queue.length === 0) return { processed: 0, failed: 0 };

  let processed = 0;
  let failed = 0;
  const remainingQueue: SyncQueueItem[] = [];

  for (const item of queue) {
    try {
      if (item.action === "upsert") {
        const { error } = await supabase.from(item.table).upsert(item.payload);
        if (error) {
          console.warn(`Queue upsert failed on ${item.table}:`, error.message);
          remainingQueue.push(item);
          failed++;
        } else {
          processed++;
        }
      } else if (item.action === "delete") {
        const { error } = await supabase.from(item.table).delete().eq("id", item.payload.id);
        if (error) {
          console.warn(`Queue delete failed on ${item.table}:`, error.message);
          remainingQueue.push(item);
          failed++;
        } else {
          processed++;
        }
      }
    } catch (err) {
      remainingQueue.push(item);
      failed++;
    }
  }

  localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(remainingQueue));
  return { processed, failed };
}

// ------------------------------------------------------------------------------
// ZERO-DELAY OPTIMISTIC WRITE FUNCTIONS
// 1. Immediately updates localStorage (0ms delay)
// 2. Returns updated data synchronously
// 3. Dispatches non-blocking Supabase upsert in background
// 4. Queues into offline sync queue if network fails
// ------------------------------------------------------------------------------

export function getUserProfile(userId: string): UserProfile {
  if (typeof window === "undefined") {
    return userId === DEMO_USER.id ? DEMO_PROFILE : { ...DEMO_PROFILE, id: userId };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE(userId));
    if (raw) return JSON.parse(raw);
    if (userId === DEMO_USER.id) {
      localStorage.setItem(STORAGE_KEYS.PROFILE(userId), JSON.stringify(DEMO_PROFILE));
      return DEMO_PROFILE;
    }
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
      language: getGlobalLanguage(),
      theme: getGlobalTheme(),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.PROFILE(userId), JSON.stringify(fresh));
    return fresh;
  } catch {
    return DEMO_PROFILE;
  }
}

export function saveProfile(userId: string, updates: Partial<UserProfile>): UserProfile {
  const current = getUserProfile(userId);
  const updated: UserProfile = {
    ...current,
    ...updates,
    id: userId,
  };

  // 1. Optimistic Local Write (0ms Delay)
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE(userId), JSON.stringify(updated));
    } catch (err) {
      console.error("Local storage error:", err);
    }
  }

  // 2. Non-blocking Background Cloud Upsert
  if (isSupabaseConfigured && userId !== DEMO_USER.id) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const payload = userProfileToDbProfile(updated);
      (async () => {
        try {
          const { error } = await supabase.from("profiles").upsert(payload);
          if (error) {
            console.warn("Background profile sync failed, enqueuing:", error.message);
            enqueueSyncMutation({
              table: "profiles",
              action: "upsert",
              payload,
              userId,
            });
          }
        } catch {
          enqueueSyncMutation({
            table: "profiles",
            action: "upsert",
            payload,
            userId,
          });
        }
      })();
    }
  }

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

export function saveDailyLog(
  userId: string,
  newLog: Omit<DailyLog, "id" | "createdAt" | "userId"> & { id?: string }
): DailyLog {
  const logs = getUserDailyLogs(userId);
  const logId = newLog.id || generateUuid();
  const created: DailyLog = {
    ...newLog,
    id: logId,
    userId,
    createdAt: new Date().toISOString(),
  };

  const existingIdx = logs.findIndex((l) => l.logDate === newLog.logDate);
  if (existingIdx >= 0) {
    logs[existingIdx] = created;
  } else {
    logs.push(created);
  }

  // 1. Optimistic Local Write (0ms Delay)
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS(userId), JSON.stringify(logs));
    } catch (err) {
      console.error("Local storage error:", err);
    }
  }

  // 2. Non-blocking Background Cloud Upsert
  if (isSupabaseConfigured && userId !== DEMO_USER.id) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const payload = dailyLogToDbLog(created);
      (async () => {
        try {
          const { error } = await supabase
            .from("daily_logs")
            .upsert(payload, { onConflict: "user_id,log_date" });
          if (error) {
            console.warn("Background daily log sync failed, enqueuing:", error.message);
            enqueueSyncMutation({
              table: "daily_logs",
              action: "upsert",
              payload,
              userId,
            });
          }
        } catch {
          enqueueSyncMutation({
            table: "daily_logs",
            action: "upsert",
            payload,
            userId,
          });
        }
      })();
    }
  }

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

export function saveVerse(
  userId: string,
  verse: Omit<SavedVerse, "id" | "createdAt" | "userId"> & { id?: string }
): SavedVerse {
  const verses = getUserSavedVerses(userId);
  const verseId = verse.id || generateUuid();
  const created: SavedVerse = {
    ...verse,
    id: verseId,
    userId,
    createdAt: new Date().toISOString(),
  };

  verses.unshift(created);

  // 1. Optimistic Local Write (0ms Delay)
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_VERSES(userId), JSON.stringify(verses));
    } catch (err) {
      console.error("Local storage error:", err);
    }
  }

  // 2. Non-blocking Background Cloud Upsert
  if (isSupabaseConfigured && userId !== DEMO_USER.id) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const payload = savedVerseToDbVerse(created);
      (async () => {
        try {
          const { error } = await supabase.from("saved_verses").upsert(payload);
          if (error) {
            console.warn("Background verse sync failed, enqueuing:", error.message);
            enqueueSyncMutation({
              table: "saved_verses",
              action: "upsert",
              payload,
              userId,
            });
          }
        } catch {
          enqueueSyncMutation({
            table: "saved_verses",
            action: "upsert",
            payload,
            userId,
          });
        }
      })();
    }
  }

  return created;
}

export function deleteVerse(userId: string, verseId: string): void {
  const verses = getUserSavedVerses(userId).filter((v) => v.id !== verseId);

  // 1. Optimistic Local Write (0ms Delay)
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_VERSES(userId), JSON.stringify(verses));
    } catch (err) {
      console.error("Local storage error:", err);
    }
  }

  // 2. Non-blocking Background Cloud Delete
  if (isSupabaseConfigured && userId !== DEMO_USER.id) {
    const supabase = getSupabaseClient();
    if (supabase) {
      (async () => {
        try {
          const { error } = await supabase
            .from("saved_verses")
            .delete()
            .eq("id", verseId)
            .eq("user_id", userId);
          if (error) {
            console.warn("Background verse delete failed, enqueuing:", error.message);
            enqueueSyncMutation({
              table: "saved_verses",
              action: "delete",
              payload: { id: verseId },
              userId,
            });
          }
        } catch {
          enqueueSyncMutation({
            table: "saved_verses",
            action: "delete",
            payload: { id: verseId },
            userId,
          });
        }
      })();
    }
  }
}

export function resetStreak(userId: string): UserProfile {
  return saveProfile(userId, {
    streakStartTimestamp: new Date().toISOString(),
  });
}

// ------------------------------------------------------------------------------
// MULTI-DEVICE CLOUD HYDRATION & CONFLICT RESOLUTION
// Compares updated_at timestamps so newest data wins during reconciliation
// ------------------------------------------------------------------------------

export async function fetchUserDataFromCloud(userId: string): Promise<{
  profile: UserProfile | null;
  dailyLogs: DailyLog[];
  savedVerses: SavedVerse[];
}> {
  if (!isSupabaseConfigured || userId === DEMO_USER.id) {
    return {
      profile: getUserProfile(userId),
      dailyLogs: getUserDailyLogs(userId),
      savedVerses: getUserSavedVerses(userId),
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      profile: getUserProfile(userId),
      dailyLogs: getUserDailyLogs(userId),
      savedVerses: getUserSavedVerses(userId),
    };
  }

  try {
    const [profileRes, logsRes, versesRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("daily_logs").select("*").eq("user_id", userId).order("log_date", { ascending: true }),
      supabase.from("saved_verses").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    ]);

    let localProfile = getUserProfile(userId);
    let resolvedProfile = localProfile;

    if (profileRes.data) {
      const cloudProfile = dbProfileToUserProfile(profileRes.data);
      // Conflict Resolution: compare updated_at
      const cloudUpdatedAt = new Date(profileRes.data.updated_at || 0).getTime();
      const localUpdatedAt = new Date(localProfile.createdAt || 0).getTime();

      if (cloudUpdatedAt >= localUpdatedAt || !localProfile.onboardingCompleted) {
        resolvedProfile = cloudProfile;
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.PROFILE(userId), JSON.stringify(cloudProfile));
        }
      }
    }

    let resolvedLogs = getUserDailyLogs(userId);
    if (logsRes.data && logsRes.data.length > 0) {
      const cloudLogs = logsRes.data.map(dbLogToDailyLog);
      resolvedLogs = cloudLogs;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.LOGS(userId), JSON.stringify(cloudLogs));
      }
    }

    let resolvedVerses = getUserSavedVerses(userId);
    if (versesRes.data && versesRes.data.length > 0) {
      const cloudVerses = versesRes.data.map(dbVerseToSavedVerse);
      resolvedVerses = cloudVerses;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.SAVED_VERSES(userId), JSON.stringify(cloudVerses));
      }
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.LAST_CLOUD_SYNC(userId), new Date().toISOString());
    }

    return {
      profile: resolvedProfile,
      dailyLogs: resolvedLogs,
      savedVerses: resolvedVerses,
    };
  } catch (err) {
    console.warn("Failed to fetch user data from cloud:", err);
    return {
      profile: getUserProfile(userId),
      dailyLogs: getUserDailyLogs(userId),
      savedVerses: getUserSavedVerses(userId),
    };
  }
}

// ------------------------------------------------------------------------------
// SESSION & AUTH HELPERS
// ------------------------------------------------------------------------------

export function getCurrentSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
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

export interface LocalUserAccount {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  createdAt: string;
}

export function getLocalAccountsRegistry(): LocalUserAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS_REGISTRY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalAccountsRegistry(accounts: LocalUserAccount[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.USERS_REGISTRY, JSON.stringify(accounts));
  } catch (err) {
    console.error("Failed to save local accounts registry:", err);
  }
}

export async function authenticateUser(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  let supabaseAuthError: string | null = null;

  // 1. Supabase Cloud Authentication
  if (isSupabaseConfigured) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: pass,
        });

        if (!error && data.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            displayName: data.user.user_metadata?.display_name || cleanEmail.split("@")[0] || "Disciple",
            isGuest: false,
          };
          saveCurrentSession(authUser);
          // Hydrate local cache immediately from cloud
          await fetchUserDataFromCloud(authUser.id);
          return { success: true, user: authUser };
        } else if (error) {
          supabaseAuthError = error.message;
        }
      } catch (err: any) {
        supabaseAuthError = err.message;
      }
    }
  }

  // 2. Offline / Local accounts fallback
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
  const cleanName = displayName.trim() || cleanEmail.split("@")[0] || "Disciple";

  if (isSupabaseConfigured) {
    const supabase = getSupabaseClient();
    if (supabase) {
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

          // Save to local registry
          const accounts = getLocalAccountsRegistry();
          const existingIdx = accounts.findIndex((a) => a.email.toLowerCase() === cleanEmail);
          const accountEntry: LocalUserAccount = {
            id: data.user.id,
            email: cleanEmail,
            passwordHash: pass,
            displayName: cleanName,
            createdAt: new Date().toISOString(),
          };
          if (existingIdx >= 0) accounts[existingIdx] = accountEntry;
          else accounts.push(accountEntry);
          saveLocalAccountsRegistry(accounts);

          // Save session
          saveCurrentSession(authUser);

          // Optimistically create initial profile in local and cloud
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
            language: getGlobalLanguage(),
            theme: getGlobalTheme(),
            createdAt: new Date().toISOString(),
          };
          saveProfile(data.user.id, initialProfile);

          return { success: true, user: authUser };
        } else if (error) {
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }
  }

  // Local fallback registration
  const accounts = getLocalAccountsRegistry();
  if (accounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: "An account with this email already exists." };
  }

  const newId = generateUuid();
  const authUser: AuthUser = {
    id: newId,
    email: cleanEmail,
    displayName: cleanName,
    isGuest: false,
  };

  accounts.push({
    id: newId,
    email: cleanEmail,
    passwordHash: pass,
    displayName: cleanName,
    createdAt: new Date().toISOString(),
  });
  saveLocalAccountsRegistry(accounts);
  saveCurrentSession(authUser);

  const initialProfile: UserProfile = {
    id: newId,
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
    language: getGlobalLanguage(),
    theme: getGlobalTheme(),
    createdAt: new Date().toISOString(),
  };
  saveProfile(newId, initialProfile);

  return { success: true, user: authUser };
}

export function loginAsDemoGuest(): AuthUser {
  saveCurrentSession(DEMO_USER);
  return DEMO_USER;
}

export async function logoutUser(): Promise<void> {
  saveCurrentSession(null);
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }
}

// ------------------------------------------------------------------------------
// METRICS & PSYCHOMETRIC CALCULATORS
// ------------------------------------------------------------------------------

export function calculateStreakFromDate(startDateStr: string | Date): number {
  if (!startDateStr) return 0;
  const start = new Date(startDateStr);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  if (diffMs < 0) return 0;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

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
  const session = getCurrentSession();
  const userId = session?.id || DEMO_USER.id;
  if (typeof window === "undefined") return;

  if (type === "fresh") {
    const freshProfile: UserProfile = {
      id: userId,
      displayName: session?.displayName || "Disciple",
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
      language: getGlobalLanguage(),
      theme: getGlobalTheme(),
      createdAt: new Date().toISOString(),
    };
    saveProfile(userId, freshProfile);
    localStorage.setItem(STORAGE_KEYS.LOGS(userId), JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SAVED_VERSES(userId), JSON.stringify([]));
  } else {
    saveProfile(userId, DEMO_PROFILE);
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

// Backwards-compatible aliases
export const saveUserProfile = saveProfile;
export const saveUserDailyLog = saveDailyLog;
export const saveUserVerse = saveVerse;
export const removeUserVerse = deleteVerse;
export const syncUserDataFromCloud = fetchUserDataFromCloud;
export const pushLocalDataToSupabase = async (userId: string): Promise<{
  success: boolean;
  profileSynced?: boolean;
  logsCount?: number;
  versesCount?: number;
  error?: string;
}> => {
  try {
    const p = getUserProfile(userId);
    saveProfile(userId, p);
    const logs = getUserDailyLogs(userId);
    for (const l of logs) saveDailyLog(userId, l);
    const verses = getUserSavedVerses(userId);
    for (const v of verses) saveVerse(userId, v);
    await flushSyncQueue();
    return { success: true, profileSynced: true, logsCount: logs.length, versesCount: verses.length };
  } catch (err: any) {
    console.error("pushLocalDataToSupabase error:", err);
    return { success: false, error: err?.message || "Failed to push data to Supabase" };
  }
};
