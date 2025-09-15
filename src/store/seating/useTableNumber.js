import { create } from "zustand";

export const useTableNumber = create((set) => ({
    tableNumber: 0,
    onSelect: (newTableNumber) => set({ tableNumber: newTableNumber }),
}));