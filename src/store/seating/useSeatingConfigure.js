import { create } from "zustand";

export const useSeatingConfigure = create((set) => ({
    seating: 1,
    setSeating: (number) => set({ seating: number }),
    resetTable: () => set({ seating: 1 }),
}));