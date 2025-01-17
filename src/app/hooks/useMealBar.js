import { create } from "zustand";

export const useMealBar = create((set) => ({
    mealNumber: 0,
    onSelect: (newMealNumber) => set({ mealNumber: newMealNumber }),
}));