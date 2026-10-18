// ==============================================================================
// UNBROKEN: Network-Aware Offline-First Cloud Auto-Sync Engine
// Automatically syncs all profile, streaks, daily logs, and scriptures
// to Supabase whenever network connectivity is available.
// ==============================================================================

import { useState, useEffect, useCallback, useRef } from "react";
import { pushLocalDataToSupabase, syncUserDataFromCloud } from "./storage";
import { isSupabaseConfigured } from "./supabase";

export type SyncState = "idle" | "syncing" | "synced" | "offline" | "error";

export const DATA_MUTATION_EVENT = "unbroken_data_mutated";

/**
 * Notifies the sync manager that data was created or updated locally
 * and should be automatically pushed to Supabase if connected.
 */
export function notifyDataChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(DATA_MUTATION_EVENT));
  }
}

export function useAutoSync(userId: string | null) {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  });
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [justReconnected, setJustReconnected] = useState(false);

  const isSyncingRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const performSync = useCallback(
    async (showNotification = false): Promise<boolean> => {
      if (!userId || !isSupabaseConfigured) {
        return false;
      }

      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setIsOnline(false);
        setSyncState("offline");
        return false;
      }

      if (isSyncingRef.current) return false;
      isSyncingRef.current = true;
      setSyncState("syncing");
      setErrorMessage(null);

      try {
        const result = await pushLocalDataToSupabase(userId);

        if (result.success) {
          const now = new Date();
          setLastSyncedAt(now);
          setSyncState("synced");
          if (showNotification) {
            setJustReconnected(true);
            setTimeout(() => setJustReconnected(false), 3500);
          }
          return true;
        } else {
          setSyncState("error");
          setErrorMessage(result.error || "Sync failed");
          return false;
        }
      } catch (err: any) {
        setSyncState("error");
        setErrorMessage(err.message || "Network error");
        return false;
      } finally {
        isSyncingRef.current = false;
      }
    },
    [userId]
  );

  // Debounced auto-sync when data changes locally
  const scheduleDebouncedSync = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      performSync(false);
    }, 1200);
  }, [performSync]);

  useEffect(() => {
    if (!userId) return;

    const handleOnline = () => {
      setIsOnline(true);
      performSync(true); // Sync immediately on reconnect with notification
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncState("offline");
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        performSync(false);
      }
    };

    const handleDataMutated = () => {
      scheduleDebouncedSync();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener(DATA_MUTATION_EVENT, handleDataMutated);

    // Initial sync on mount
    if (navigator.onLine) {
      performSync(false);
    } else {
      setSyncState("offline");
    }

    // Periodic heartbeat sync every 60s
    const interval = setInterval(() => {
      if (navigator.onLine) {
        performSync(false);
      }
    }, 60000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener(DATA_MUTATION_EVENT, handleDataMutated);
      clearInterval(interval);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [userId, performSync, scheduleDebouncedSync]);

  return {
    isOnline,
    syncState,
    lastSyncedAt,
    errorMessage,
    justReconnected,
    syncNow: () => performSync(true),
  };
}
