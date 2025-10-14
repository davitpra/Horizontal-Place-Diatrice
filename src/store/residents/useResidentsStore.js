import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

export const useResidentsStore = create(
  persist(
    (set) => {
      return {
        residents: [],
        setResidents: (residents) => set({ residents: changeFormat(residents) }),
      };
    },
    {
      name: 'residents-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

function changeFormat(residents) {
  return residents.map((resident) => {
    if (resident.meal) return resident;
    else {
    const {
      Breakfast_preferences,
      Lunch_preferences,
      Supper_preferences,
      ...rest
    } = resident;

    // Helper function to filter the valid properties
    function filterValidProperties(obj) {
      return Object.fromEntries(
        Object.entries(obj).filter(
          ([, value]) =>
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value !== false &&
            value !== "none"
        )
      );
    }

    // Array of meals preferences with the valid properties
    const meals = [
      filterValidProperties({
        Water: Breakfast_preferences?.water,
        Hotdrink: Breakfast_preferences?.Hotdrink,
        Cereals: Breakfast_preferences?.Cereals,
        Juice: Breakfast_preferences?.Juice,
        Milk: Breakfast_preferences?.Milk,
        Eggs: Breakfast_preferences?.eggs,
        Toast: Breakfast_preferences?.toast,
        FruitPlate: Breakfast_preferences?.Fruit_plate ? "Add" : "none",
        Yogurt: Breakfast_preferences?.Yogurt ? "Add" : "none",
        Muffing: Breakfast_preferences?.Muffing ? "Add" : "none",
        onTray: Breakfast_preferences?.onTray,
        Additionals: Breakfast_preferences?.additionals,
        Observation: Breakfast_preferences?.comentaries,
      }),
      filterValidProperties({
        Water: Lunch_preferences?.water,
        Hotdrink: Lunch_preferences?.Hotdrink,
        Juice: Lunch_preferences?.Juice,
        Milk: Lunch_preferences?.Milk,
        onTray: Lunch_preferences?.onTray,
        Additionals: Lunch_preferences?.additionals,
        Observation: Lunch_preferences?.comentaries,
      }),
      filterValidProperties({
        Water: Supper_preferences?.water,
        Hotdrink: Supper_preferences?.Hotdrink,
        Juice: Supper_preferences?.Juice,
        Milk: Supper_preferences?.Milk,
        onTray: Supper_preferences?.onTray,
        Additionals: Supper_preferences?.additionals,
        Observation: Supper_preferences?.comentaries,
      }),
    ];

    return { ...rest, meals };
  }
  });
}
