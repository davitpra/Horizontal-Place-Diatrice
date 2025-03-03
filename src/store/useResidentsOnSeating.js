import { create } from "zustand";

export const useResidentsOnSeating = create((set) => ({
  residents: [],
  setResidents: (residents) => set({ residents }),
}));