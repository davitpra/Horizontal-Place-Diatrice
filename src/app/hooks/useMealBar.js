import { create } from "zustand";

export const useMealBar = create((set) => ({
    mealNumber: 1,
    onSelect: (newMealNumber) => set({ mealNumber: newMealNumber }),
}));