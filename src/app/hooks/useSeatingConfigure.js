import { create } from "zustand";

export const useSeatingConfigure = create((set) => ({
    seating: 0,
    setSeating: (number) => set({ seating: number }),
    resetTable: () => set({ seating: 0 }),
}));