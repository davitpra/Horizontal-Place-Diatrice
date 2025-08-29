import { create } from "zustand";

export const  useDayLunchStore = create((set) => ({
  dayLunch: [],
  setDayLunch: (dayLunch) => set({ dayLunch }),
}));
   