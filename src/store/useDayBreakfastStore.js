import { create } from "zustand";

export const  useDayBreakfastStore = create((set) => ({
  dayBreakfast: [],
  setDayBreakfast: (dayBreakfast) => set({ dayBreakfast }),
}));
   