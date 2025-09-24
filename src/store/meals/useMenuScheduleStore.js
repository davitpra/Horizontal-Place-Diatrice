import { create } from "zustand";

export const useMenuScheduleStore = create((set) => ({
  menuSchedule: [
    { data: null }, // lunchMenu
    { data: null }  // supperMenu
  ],
  setMenuSchedule: (menuSchedule) => set({ menuSchedule }),
}));