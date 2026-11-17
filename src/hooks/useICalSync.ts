import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

// Debounce guard so we never fire multiple syncs in parallel
let syncInProgress = false;
let lastSyncTime = 0;
const SYNC_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
const DEBOUNCE_MS = 5000; // 5 seconds minimum between page-load syncs

export function useICalSync(onSyncComplete?: () => void) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSync = async (isRetry = false) => {
    const now = Date.now();

    // Skip if another sync is already in progress
    if (syncInProgress) return;

    // Debounce: skip if synced very recently (unless this is a forced retry)
    if (!isRetry && now - lastSyncTime < DEBOUNCE_MS) return;

    syncInProgress = true;
    lastSyncTime = now;
    setIsSyncing(true);

    try {
      const { error } = await supabase.functions.invoke("ical-sync");
      if (error) throw error;

      setLastSynced(new Date());
      onSyncComplete?.();
    } catch (err) {
      // Silent failure — schedule one retry after 60 seconds
      if (!isRetry) {
        retryTimerRef.current = setTimeout(() => {
          runSync(true);
        }, 60_000);
      }
      // Log silently without exposing to users
      console.error("[iCal Sync] Sync failed, retrying in 60s:", err);
    } finally {
      syncInProgress = false;
      setIsSyncing(false);
    }
  };

  // On mount: trigger sync once on page load
  useEffect(() => {
    runSync();

    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  return { isSyncing, lastSynced, triggerSync: runSync };
}
