import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

export const useWeeklyMenuStore = create(
  persist(
    (set) => ({
      weeklyMenu: [],
      setWeeklyMenu: (weeklyMenu) => set({ weeklyMenu: Array.isArray(weeklyMenu) ? weeklyMenu : [] }),
    }),
    {
      name: 'weekly-menu-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
