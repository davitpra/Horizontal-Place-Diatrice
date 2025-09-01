import { create } from "zustand";

export const  useDaySupperStore = create((set) => ({
  daySupper: [],
  setDayLunch: (daySupper) => set({ daySupper }),
}));
   