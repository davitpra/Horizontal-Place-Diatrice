import { create } from "zustand";

export const useTableNumber = create((set) => ({
    tableNumber: 0,
    onSelect: (newTableNumber) => set({ tableNumber: newTableNumber }),
    // increaseTable: () => set((state) => ({ tableNumber: state.tableNumber + 1 })),
    // resetTable: () => set({ tableNumber: 0 }),
}));