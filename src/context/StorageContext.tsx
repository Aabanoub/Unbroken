"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { UserProfile, DailyLog, SavedVerse, AuthUser } from "@/types";
import {
  getCurrentSession,
  saveCurrentSession,
  logoutUser,
  getUserProfile,
  saveProfile,
  getUserDailyLogs,
  saveDailyLog,
  getUserSavedVerses,
  saveVerse,
  deleteVerse,
  resetAppData,
  fetchUserDataFromCloud,
  flushSyncQueue,
  dbProfileToUserProfile,
  dbLogToDailyLog,
  dbVerseToSavedVerse,
  DEMO_USER,
} from "@/lib/storage";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export type SyncHealth = "synced" | "syncing" | "offline" | "error";

interface StorageContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  dailyLogs: DailyLog[];
  savedVerses: SavedVerse[];
  syncStatus: SyncHealth;
  lastSyncedAt: Date | null;
  isOnline: boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addDailyLog: (log: Omit<DailyLog, "id" | "createdAt" | "userId"> & { id?: string }) => void;
  addSavedVerse: (verse: Omit<SavedVerse, "id" | "createdAt" | "userId"> & { id?: string }) => void;
  removeSavedVerse: (verseId: string) => void;
  resetApp: (type: "fresh" | "demo") => void;
  refreshData: () => Promise<void>;
  setUserSession: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

const StorageContext = createContext<StorageContextType | null>(null);

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncHealth>("synced");
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  });

  const realtimeChannelRef = useRef<any>(null);

  // Hydrate local cache into React state immediately (0ms)
  const hydrateLocal = useCallback((activeUser: AuthUser) => {
    const p = getUserProfile(activeUser.id);
    const l = getUserDailyLogs(activeUser.id);
    const v = getUserSavedVerses(activeUser.id);
    setProfile(p);
    setDailyLogs(l);
    setSavedVerses(v);
  }, []);

  // Fetch fresh cloud data and reconcile (non-blocking)
  const syncWithCloud = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured || userId === DEMO_USER.id) {
      setSyncStatus(navigator.onLine ? "synced" : "offline");
      return;
    }

    if (!navigator.onLine) {
      setSyncStatus("offline");
      return;
    }

    setSyncStatus("syncing");
    try {
      // 1. Flush any pending offline mutations first
      await flushSyncQueue();

      // 2. Pull latest data from Supabase
      const cloud = await fetchUserDataFromCloud(userId);
      if (cloud.profile) setProfile(cloud.profile);
      setDailyLogs(cloud.dailyLogs);
      setSavedVerses(cloud.savedVerses);

      setLastSyncedAt(new Date());
      setSyncStatus("synced");
    } catch (err) {
      console.warn("Cloud sync error:", err);
      setSyncStatus("error");
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setUser(session);
      hydrateLocal(session);
      syncWithCloud(session.id);
    }

    // Also check Supabase active auth session if configured
    if (isSupabaseConfigured) {
      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.auth.getSession().then(({ data: { session: supaSession } }) => {
          if (supaSession?.user) {
            const authUser: AuthUser = {
              id: supaSession.user.id,
              email: supaSession.user.email || "",
              displayName: supaSession.user.user_metadata?.display_name || supaSession.user.email?.split("@")[0] || "Disciple",
              isGuest: false,
            };
            setUser(authUser);
            saveCurrentSession(authUser);
            hydrateLocal(authUser);
            syncWithCloud(authUser.id);
          }
        });

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, supaSession) => {
          if (event === "SIGNED_IN" && supaSession?.user) {
            const authUser: AuthUser = {
              id: supaSession.user.id,
              email: supaSession.user.email || "",
              displayName: supaSession.user.user_metadata?.display_name || supaSession.user.email?.split("@")[0] || "Disciple",
              isGuest: false,
            };
            setUser(authUser);
            saveCurrentSession(authUser);
            hydrateLocal(authUser);
            syncWithCloud(authUser.id);
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            setProfile(null);
            setDailyLogs([]);
            setSavedVerses([]);
            saveCurrentSession(null);
          }
        });

        return () => {
          authListener.subscription.unsubscribe();
        };
      }
    }
  }, [hydrateLocal, syncWithCloud]);

  // Network and Visibility Listeners for Offline Queue Flush
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus("syncing");
      flushSyncQueue().then(() => {
        if (user) {
          syncWithCloud(user.id);
        } else {
          setSyncStatus("synced");
        }
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus("offline");
    };

    const handleFocusOrVisibility = () => {
      if (typeof window !== "undefined" && navigator.onLine && user) {
        flushSyncQueue().then(() => {
          syncWithCloud(user.id);
        });
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("focus", handleFocusOrVisibility);
    document.addEventListener("visibilitychange", handleFocusOrVisibility);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("focus", handleFocusOrVisibility);
      document.removeEventListener("visibilitychange", handleFocusOrVisibility);
    };
  }, [user, syncWithCloud]);

  // STEP 4: Realtime Multi-Device Subscription
  useEffect(() => {
    if (!user || user.isGuest || !isSupabaseConfigured) {
      if (realtimeChannelRef.current) {
        realtimeChannelRef.current.unsubscribe();
        realtimeChannelRef.current = null;
      }
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) return;

    if (realtimeChannelRef.current) {
      realtimeChannelRef.current.unsubscribe();
    }

    const channelName = `user-sync-${user.id}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          const newRow = payload.new as any;
          if (newRow && Object.keys(newRow).length > 0) {
            const updatedProfile = dbProfileToUserProfile(newRow);
            setProfile((prev) => {
              // Reconcile with latest timestamp
              const incomingTime = new Date(newRow.updated_at || 0).getTime();
              const prevTime = prev ? new Date(prev.createdAt || 0).getTime() : 0;
              if (incomingTime >= prevTime || !prev?.onboardingCompleted) {
                if (typeof window !== "undefined") {
                  localStorage.setItem(`unbroken_profile_${user.id}`, JSON.stringify(updatedProfile));
                }
                return updatedProfile;
              }
              return prev;
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "daily_logs",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newRow = payload.new as any;
          const oldRow = payload.old as any;
          if ((payload.eventType === "INSERT" || payload.eventType === "UPDATE") && newRow) {
            const incomingLog = dbLogToDailyLog(newRow);
            setDailyLogs((prev) => {
              const idx = prev.findIndex((l) => l.logDate === incomingLog.logDate);
              let next: DailyLog[];
              if (idx >= 0) {
                next = [...prev];
                next[idx] = incomingLog;
              } else {
                next = [...prev, incomingLog].sort((a, b) => a.logDate.localeCompare(b.logDate));
              }
              if (typeof window !== "undefined") {
                localStorage.setItem(`unbroken_logs_${user.id}`, JSON.stringify(next));
              }
              return next;
            });
          } else if (payload.eventType === "DELETE" && oldRow?.id) {
            setDailyLogs((prev) => {
              const next = prev.filter((l) => l.id !== oldRow.id);
              if (typeof window !== "undefined") {
                localStorage.setItem(`unbroken_logs_${user.id}`, JSON.stringify(next));
              }
              return next;
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "saved_verses",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newRow = payload.new as any;
          const oldRow = payload.old as any;
          if ((payload.eventType === "INSERT" || payload.eventType === "UPDATE") && newRow) {
            const incomingVerse = dbVerseToSavedVerse(newRow);
            setSavedVerses((prev) => {
              const exists = prev.some((v) => v.id === incomingVerse.id);
              let next: SavedVerse[];
              if (exists) {
                next = prev.map((v) => (v.id === incomingVerse.id ? incomingVerse : v));
              } else {
                next = [incomingVerse, ...prev];
              }
              if (typeof window !== "undefined") {
                localStorage.setItem(`unbroken_verses_${user.id}`, JSON.stringify(next));
              }
              return next;
            });
          } else if (payload.eventType === "DELETE" && oldRow?.id) {
            setSavedVerses((prev) => {
              const next = prev.filter((v) => v.id !== oldRow.id);
              if (typeof window !== "undefined") {
                localStorage.setItem(`unbroken_verses_${user.id}`, JSON.stringify(next));
              }
              return next;
            });
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setSyncStatus("synced");
        }
      });

    realtimeChannelRef.current = channel;

    return () => {
      channel.unsubscribe();
      realtimeChannelRef.current = null;
    };
  }, [user]);

  // MUTATION ACTIONS (0ms Optimistic Local + Background Cloud Sync)

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      if (!user) return;
      const updated = saveProfile(user.id, updates);
      setProfile(updated);
    },
    [user]
  );

  const addDailyLog = useCallback(
    (log: Omit<DailyLog, "id" | "createdAt" | "userId"> & { id?: string }) => {
      if (!user) return;
      const created = saveDailyLog(user.id, log);
      setDailyLogs((prev) => {
        const idx = prev.findIndex((l) => l.logDate === created.logDate);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = created;
          return next;
        }
        return [...prev, created].sort((a, b) => a.logDate.localeCompare(b.logDate));
      });
    },
    [user]
  );

  const addSavedVerse = useCallback(
    (verse: Omit<SavedVerse, "id" | "createdAt" | "userId"> & { id?: string }) => {
      if (!user) return;
      const created = saveVerse(user.id, verse);
      setSavedVerses((prev) => [created, ...prev.filter((v) => v.id !== created.id)]);
    },
    [user]
  );

  const removeSavedVerse = useCallback(
    (verseId: string) => {
      if (!user) return;
      deleteVerse(user.id, verseId);
      setSavedVerses((prev) => prev.filter((v) => v.id !== verseId));
    },
    [user]
  );

  const resetApp = useCallback(
    (type: "fresh" | "demo") => {
      if (!user) return;
      resetAppData(type);
      hydrateLocal(user);
    },
    [user, hydrateLocal]
  );

  const refreshData = useCallback(async () => {
    if (user) {
      await syncWithCloud(user.id);
    }
  }, [user, syncWithCloud]);

  const setUserSession = useCallback(
    (newUser: AuthUser | null) => {
      setUser(newUser);
      saveCurrentSession(newUser);
      if (newUser) {
        hydrateLocal(newUser);
        syncWithCloud(newUser.id);
      } else {
        setProfile(null);
        setDailyLogs([]);
        setSavedVerses([]);
      }
    },
    [hydrateLocal, syncWithCloud]
  );

  const logout = useCallback(async () => {
    await logoutUser();
    setUserSession(null);
  }, [setUserSession]);

  const value: StorageContextType = {
    user,
    profile,
    dailyLogs,
    savedVerses,
    syncStatus,
    lastSyncedAt,
    isOnline,
    updateProfile,
    addDailyLog,
    addSavedVerse,
    removeSavedVerse,
    resetApp,
    refreshData,
    setUserSession,
    logout,
  };

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
};

export function useStorage(): StorageContextType {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error("useStorage must be used within a StorageProvider");
  }
  return context;
}
