import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

export const useDayMenusStore = create(
  persist(
    (set) => ({
      dayMenus: [],
      setDayMenus: (dayMenus) => set({ dayMenus }),
    }),
    {
      name: 'day-menus-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);