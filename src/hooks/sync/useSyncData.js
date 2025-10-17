import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Hook for synchronizing data with backend using intelligent polling or manual sync
 * @param {Function} fetchFunction - Function to fetch data from backend
 * @param {Function} onDataUpdate - Callback when new data is received
 * @param {Object} options - Configuration options
 * @param {number} options.interval - Polling interval in milliseconds (default: 30000 = 30s)
 * @param {boolean} options.enabled - Whether auto-polling is enabled (default: true). forceSync works regardless of this flag.
 * @param {boolean} options.pauseOnInactive - Pause when tab is inactive (default: true)
 * @returns {Object} - { isSyncing, forceSync }
 */
export const useSyncData = (fetchFunction, onDataUpdate, options = {}) => {
  const {
    interval = 30000, // 30 seconds default
    enabled = true,
    pauseOnInactive = true,
  } = options;

  const [isSyncing, setIsSyncing] = useState(false);
  const intervalRef = useRef(null);
  const isActiveRef = useRef(true);

  // Track if tab is visible/active
  useEffect(() => {
    if (!pauseOnInactive) return;

    const handleVisibilityChange = () => {
      isActiveRef.current = !document.hidden;
      
      // If tab becomes active again, sync immediately
      if (isActiveRef.current && enabled) {
        syncData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pauseOnInactive, enabled]);

  // Main sync function (respects enabled flag for auto-sync)
  const syncData = useCallback(async () => {
    // Don't sync if tab is inactive and pauseOnInactive is true
    if (pauseOnInactive && !isActiveRef.current) {
      return;
    }

    if (!enabled || !fetchFunction) {
      return;
    }

    try {
      setIsSyncing(true);
      const newData = await fetchFunction();
      
      if (newData && onDataUpdate) {
        onDataUpdate(newData);
      }
    } catch (error) {
      console.error('[useSyncData] Error syncing data:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [fetchFunction, onDataUpdate, enabled, pauseOnInactive]);

  // Force sync function (works regardless of enabled flag for manual sync)
  const forceSync = useCallback(async () => {
    if (!fetchFunction) {
      return;
    }

    try {
      setIsSyncing(true);
      const newData = await fetchFunction();
      
      if (newData && onDataUpdate) {
        onDataUpdate(newData);
      }
    } catch (error) {
      console.error('[useSyncData] Error syncing data:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [fetchFunction, onDataUpdate]);

  // Setup polling interval
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Start polling
    intervalRef.current = setInterval(() => {
      syncData();
    }, interval);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval, syncData]);

  return {
    isSyncing,
    forceSync,
  };
};

