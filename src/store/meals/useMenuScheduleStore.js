import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

export const useMenuScheduleStore = create(
  persist(
    (set) => ({
      menuSchedule: [
        { data: null }, // lunchMenu
        { data: null }  // supperMenu
      ],
      setMenuSchedule: (menuSchedule) => set({ menuSchedule }),
    }),
    {
      name: 'menu-schedule-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);