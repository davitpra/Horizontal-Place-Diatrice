"use client";
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useSyncData } from '@/hooks/sync/useSyncData';
import { getAllResidents } from '@/strapi/residents/getAllResidents';
import { getWeeklyMenu } from '@/strapi/menuSchedule/getWeeklyMenu';
import { getDayBreakfasts } from '@/strapi/meals/breakfast/getDayBreakfasts';
import { getDayLunchs } from '@/strapi/meals/lunch/getDayLunchs';
import { getDaySuppers } from '@/strapi/meals/supper/getDaySuppers';
import { useResidentsStore } from '@/store/residents/useResidentsStore';
import { useWeeklyMenuStore } from '@/store/meals/useWeeklyMenuStore';
import { useMealsStore } from '@/store/meals/useMealsStore';
import { date } from '@/constants/date';
import toast from 'react-hot-toast';
import { 
  SYNC_CONFIG, 
  SYNC_MESSAGES 
} from '@/config/sync.config';

const SyncContext = createContext({
  isSyncing: false,
  lastSync: null,
  forceSync: () => {},
  enableSync: () => {},
  disableSync: () => {},
  syncEnabled: true,
});

export const useSyncContext = () => useContext(SyncContext);

/**
 * SyncProvider - Manages real-time synchronization across devices
 * Wraps the application and keeps data in sync with backend
 */
export const SyncProvider = ({ children }) => {
  const [syncEnabled, setSyncEnabled] = useState(SYNC_CONFIG.ENABLED_BY_DEFAULT);
  const [showSyncNotifications, setShowSyncNotifications] = useState(SYNC_CONFIG.SHOW_NOTIFICATIONS);

  const setResidents = useResidentsStore((state) => state.setResidents);
  const setWeeklyMenu = useWeeklyMenuStore((state) => state.setWeeklyMenu);
  const setMeal = useMealsStore((state) => state.setMeal);

  // Track meals sync for consolidated notification
  const mealsSyncedRef = useRef({ breakfast: false, lunch: false, supper: false });
  const notificationTimeoutRef = useRef(null);

  // Sync residents data
  const {
    isSyncing: isSyncingResidents,
    lastSync: lastSyncResidents,
    forceSync: forceSyncResidents,
  } = useSyncData(
    getAllResidents,
    (newResidents) => {
      if (!newResidents || newResidents.length === 0) return;
      
      setResidents(newResidents);
      
      if (showSyncNotifications) {
        toast.success(SYNC_MESSAGES.RESIDENTS_UPDATED, {
          duration: 2000,
          icon: '🔄',
        });
      }
      console.log('[SyncProvider] Residents synced:', newResidents.length);
    },
    {
      interval: SYNC_CONFIG.RESIDENTS_INTERVAL,
      enabled: syncEnabled,
      pauseOnInactive: SYNC_CONFIG.PAUSE_ON_INACTIVE,
    }
  );

  // Sync weekly menu data
  const {
    isSyncing: isSyncingWeeklyMenu,
    lastSync: lastSyncWeeklyMenu,
    forceSync: forceSyncWeeklyMenu,
  } = useSyncData(
    getWeeklyMenu,
    (newWeeklyMenu) => {
      if (!newWeeklyMenu || newWeeklyMenu.length === 0) return;
      
      setWeeklyMenu(newWeeklyMenu);
      
      if (showSyncNotifications) {
        toast.success(SYNC_MESSAGES.WEEKLY_MENU_UPDATED, {
          duration: 2000,
          icon: '📅',
        });
      }
      console.log('[SyncProvider] Weekly menu synced:', newWeeklyMenu.length);
    },
    {
      interval: SYNC_CONFIG.WEEKLY_MENU_INTERVAL,
      enabled: syncEnabled,
      pauseOnInactive: SYNC_CONFIG.PAUSE_ON_INACTIVE,
    }
  );

  // Sync breakfast data
  const {
    isSyncing: isSyncingBreakfast,
    lastSync: lastSyncBreakfast,
    forceSync: forceSyncBreakfast,
  } = useSyncData(
    () => getDayBreakfasts(date),
    (newBreakfast) => {
      if (!newBreakfast || newBreakfast.length === 0) return;
      
      setMeal('breakfast', newBreakfast);
      mealsSyncedRef.current.breakfast = true;
      console.log('[SyncProvider] Breakfast synced:', newBreakfast.length);
    },
    {
      interval: SYNC_CONFIG.BREAKFAST_INTERVAL,
      enabled: syncEnabled,
      pauseOnInactive: SYNC_CONFIG.PAUSE_ON_INACTIVE,
    }
  );

  // Sync lunch data
  const {
    isSyncing: isSyncingLunch,
    lastSync: lastSyncLunch,
    forceSync: forceSyncLunch,
  } = useSyncData(
    () => getDayLunchs(date),
    (newLunch) => {
      if (!newLunch || newLunch.length === 0) return;
      
      setMeal('lunch', newLunch);
      mealsSyncedRef.current.lunch = true;
      console.log('[SyncProvider] Lunch synced:', newLunch.length);
    },
    {
      interval: SYNC_CONFIG.LUNCH_INTERVAL,
      enabled: syncEnabled,
      pauseOnInactive: SYNC_CONFIG.PAUSE_ON_INACTIVE,
    }
  );

  // Sync supper data
  const {
    isSyncing: isSyncingSupper,
    lastSync: lastSyncSupper,
    forceSync: forceSyncSupper,
  } = useSyncData(
    () => getDaySuppers(date),
    (newSupper) => {
      if (!newSupper || newSupper.length === 0) return;
      
      setMeal('supper', newSupper);
      mealsSyncedRef.current.supper = true;
      console.log('[SyncProvider] Supper synced:', newSupper.length);
    },
    {
      interval: SYNC_CONFIG.SUPPER_INTERVAL,
      enabled: syncEnabled,
      pauseOnInactive: SYNC_CONFIG.PAUSE_ON_INACTIVE,
    }
  );

  // Consolidated meals notification
  useEffect(() => {
    const { breakfast, lunch, supper } = mealsSyncedRef.current;
    
    if (breakfast || lunch || supper) {
      // Clear any existing timeout
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }

      // Wait a bit to collect all syncs, then show one notification
      notificationTimeoutRef.current = setTimeout(() => {
        if (showSyncNotifications) {
          toast.success(SYNC_MESSAGES.MEALS_UPDATED, {
            duration: 2000,
            icon: '🍽️',
          });
        }

        // Reset flags
        mealsSyncedRef.current = { breakfast: false, lunch: false, supper: false };
      }, 500); // Wait 500ms to collect all syncs
    }

    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, [lastSyncBreakfast, lastSyncLunch, lastSyncSupper, showSyncNotifications]);

  const isSyncing = isSyncingResidents || isSyncingWeeklyMenu || isSyncingBreakfast || isSyncingLunch || isSyncingSupper;
  const lastSync = lastSyncResidents || lastSyncWeeklyMenu || lastSyncBreakfast || lastSyncLunch || lastSyncSupper;

  const forceSync = () => {
    forceSyncResidents();
    forceSyncWeeklyMenu();
    forceSyncBreakfast();
    forceSyncLunch();
    forceSyncSupper();
    toast.success(SYNC_MESSAGES.SYNCING, {
      duration: 1500,
      icon: '🔄',
    });
  };

  const enableSync = () => {
    setSyncEnabled(true);
    toast.success(SYNC_MESSAGES.SYNC_ENABLED, {
      duration: 2000,
      icon: '✅',
    });
  };

  const disableSync = () => {
    setSyncEnabled(false);
    toast(SYNC_MESSAGES.SYNC_DISABLED, {
      duration: 2000,
      icon: 'ℹ️',
    });
  };

  const contextValue = {
    isSyncing,
    lastSync,
    forceSync,
    enableSync,
    disableSync,
    syncEnabled,
    showSyncNotifications,
    setShowSyncNotifications,
  };

  return (
    <SyncContext.Provider value={contextValue}>
      {children}
    </SyncContext.Provider>
  );
};

