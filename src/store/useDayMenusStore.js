import { create } from "zustand";

export const  useDayMenusStore = create((set) => ({
  dayMenus: [],
  setDayMenus: (dayMenus) => set({ dayMenus }),
}));