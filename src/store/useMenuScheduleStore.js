import { create } from "zustand";

export const  useMenuScheduleStore = create((set) => ({
  menuSchedule: [],
  setMenuSchedule: (menuSchedule) => set({ menuSchedule }),
}));