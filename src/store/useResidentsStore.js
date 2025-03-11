import { create } from "zustand";

export const useResidentsStore = create((set) => ({
  residents: [],
  setResidents: (residents) => set({ residents }),
}));