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
  forceSync: () => {},
});

export const useSyncContext = () => useContext(SyncContext);

/**
 * SyncProvider - Manages manual synchronization across devices
 * Wraps the application and provides manual sync functionality via button
 */
export const SyncProvider = ({ children }) => {
  const [showSyncNotifications, setShowSyncNotifications] = useState(SYNC_CONFIG.SHOW_NOTIFICATIONS);

  const setResidents = useResidentsStore((state) => state.setResidents);
  const setWeeklyMenu = useWeeklyMenuStore((state) => state.setWeeklyMenu);
  const setMeal = useMealsStore((state) => state.setMeal);

  // Track meals sync for consolidated notification
  const mealsSyncedRef = useRef({ breakfast: false, lunch: false, supper: false });
  const notificationTimeoutRef = useRef(null);

  // Sync residents data (manual only)
  const {
    isSyncing: isSyncingResidents,
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
    },
    {
      enabled: false, // No auto-sync, manual only
    }
  );

  // Sync weekly menu data (manual only)
  const {
    isSyncing: isSyncingWeeklyMenu,
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
    },
    {
      enabled: false, // No auto-sync, manual only
    }
  );

  // Sync breakfast data (manual only)
  const {
    isSyncing: isSyncingBreakfast,
    forceSync: forceSyncBreakfast,
  } = useSyncData(
    () => getDayBreakfasts(date),
    (newBreakfast) => {
      if (!newBreakfast || newBreakfast.length === 0) return;
      
      setMeal('breakfast', newBreakfast);
      mealsSyncedRef.current.breakfast = true;
    },
    {
      enabled: false, // No auto-sync, manual only
    }
  );

  // Sync lunch data (manual only)
  const {
    isSyncing: isSyncingLunch,
    forceSync: forceSyncLunch,
  } = useSyncData(
    () => getDayLunchs(date),
    (newLunch) => {
      if (!newLunch || newLunch.length === 0) return;
      
      setMeal('lunch', newLunch);
      mealsSyncedRef.current.lunch = true;
    },
    {
      enabled: false, // No auto-sync, manual only
    }
  );

  // Sync supper data (manual only)
  const {
    isSyncing: isSyncingSupper,
    forceSync: forceSyncSupper,
  } = useSyncData(
    () => getDaySuppers(date),
    (newSupper) => {
      if (!newSupper || newSupper.length === 0) return;
      
      setMeal('supper', newSupper);
      mealsSyncedRef.current.supper = true;
    },
    {
      enabled: false, // No auto-sync, manual only
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
  }, [isSyncingBreakfast, isSyncingLunch, isSyncingSupper, showSyncNotifications]);

  const isSyncing = isSyncingResidents || isSyncingWeeklyMenu || isSyncingBreakfast || isSyncingLunch || isSyncingSupper;

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

  const contextValue = {
    isSyncing,
    forceSync,
    showSyncNotifications,
    setShowSyncNotifications,
  };

  return (
    <SyncContext.Provider value={contextValue}>
      {children}
    </SyncContext.Provider>
  );
};

