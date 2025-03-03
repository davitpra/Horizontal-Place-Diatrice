import { create } from "zustand";

export const usePreferenceStore = create((set) => ({
  preferences: [],
  setPreferences: (preferences) => set({ preferences }),
}));