import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Hook for synchronizing data with backend using timestamp-based change detection
 * Only fetches new data when timestamp has changed (more efficient)
 * @param {Function} fetchTimestamp - Function to fetch last updated timestamp
 * @param {Function} fetchData - Function to fetch full data
 * @param {Function} onDataUpdate - Callback when new data is received
 * @param {Object} options - Configuration options
 * @returns {Object} - { isSyncing, lastSync, forceSync, hasChanges }
 */
export const useSyncWithTimestamp = (
  fetchTimestamp,
  fetchData,
  onDataUpdate,
  options = {}
) => {
  const {
    interval = 15000, // Check every 15 seconds
    enabled = true,
    pauseOnInactive = true,
  } = options;

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  const intervalRef = useRef(null);
  const isActiveRef = useRef(true);
  const lastTimestampRef = useRef(null);

  // Track if tab is visible/active
  useEffect(() => {
    if (!pauseOnInactive) return;

    const handleVisibilityChange = () => {
      isActiveRef.current = !document.hidden;
      
      // If tab becomes active again, check for changes immediately
      if (isActiveRef.current && enabled) {
        checkForChanges();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pauseOnInactive, enabled]);

  // Check if data has changed by comparing timestamps
  const checkForChanges = useCallback(async () => {
    // Don't check if tab is inactive and pauseOnInactive is true
    if (pauseOnInactive && !isActiveRef.current) {
      return false;
    }

    if (!enabled || !fetchTimestamp) {
      return false;
    }

    try {
      const currentTimestamp = await fetchTimestamp();
      
      // If timestamp is different, data has changed
      if (lastTimestampRef.current !== null && 
          currentTimestamp !== lastTimestampRef.current) {
        console.log('[useSyncWithTimestamp] Changes detected, fetching new data...');
        setHasChanges(true);
        await syncData();
        return true;
      } else if (lastTimestampRef.current === null) {
        // First time, just store timestamp
        lastTimestampRef.current = currentTimestamp;
      }
      
      return false;
    } catch (error) {
      console.error('[useSyncWithTimestamp] Error checking for changes:', error);
      return false;
    }
  }, [fetchTimestamp, enabled, pauseOnInactive]);

  // Fetch new data when changes detected
  const syncData = useCallback(async () => {
    if (!enabled || !fetchData) {
      return;
    }

    try {
      setIsSyncing(true);
      const newData = await fetchData();
      
      if (newData && onDataUpdate) {
        onDataUpdate(newData);
      }
      
      // Update timestamp after successful sync
      const newTimestamp = await fetchTimestamp();
      lastTimestampRef.current = newTimestamp;
      
      setLastSync(new Date());
      setHasChanges(false);
    } catch (error) {
      console.error('[useSyncWithTimestamp] Error syncing data:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [fetchData, fetchTimestamp, onDataUpdate, enabled]);

  // Force sync function (can be called manually)
  const forceSync = useCallback(async () => {
    console.log('[useSyncWithTimestamp] Force sync triggered');
    lastTimestampRef.current = null; // Reset timestamp to force update
    await checkForChanges();
  }, [checkForChanges]);

  // Setup polling interval for checking changes
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Start polling for changes
    intervalRef.current = setInterval(() => {
      checkForChanges();
    }, interval);

    // Check immediately on mount
    checkForChanges();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval, checkForChanges]);

  return {
    isSyncing,
    lastSync,
    forceSync,
    hasChanges,
  };
};

