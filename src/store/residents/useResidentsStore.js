import { create } from "zustand";

export const useResidentsStore = create((set) => {
  return {
    residents: [],
    setResidents: (residents) => set({ residents: changeFormat(residents) }),
  };
});

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

    //GET DAY OF WEEK
    let today = new Date();
    const dayOfWeek = today.getDay();

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
        Water: Breakfast_preferences?.Breakfast_drink_preference?.water,
        Hotdrink: Breakfast_preferences?.Breakfast_drink_preference?.Hotdrink,
        Cereals: Breakfast_preferences?.Cereals,
        Juice: Breakfast_preferences?.Breakfast_drink_preference?.Juice,
        Milk: Breakfast_preferences?.Breakfast_drink_preference?.Milk,
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
        Water: Lunch_preferences?.Lunch_drink_preference?.water,
        Hotdrink: Lunch_preferences?.Lunch_drink_preference?.Hotdrink,
        Juice: Lunch_preferences?.Lunch_drink_preference?.Juice,
        Milk: Lunch_preferences?.Lunch_drink_preference?.Milk,
        onTray: Lunch_preferences?.onTray,
        Additionals: Lunch_preferences?.additionals,
        Observation: Lunch_preferences?.comentaries,
      }),
      filterValidProperties({
        Water: Supper_preferences?.Lunch_drink_preference?.water,
        Hotdrink: Supper_preferences?.Lunch_drink_preference?.Hotdrink,
        Juice: Supper_preferences?.Lunch_drink_preference?.Juice,
        Milk: Supper_preferences?.Lunch_drink_preference?.Milk,
        onTray: Supper_preferences?.onTray,
        Additionals: Supper_preferences?.additionals,
        Observation: Supper_preferences?.comentaries,
      }),
    ];

    // if it is Thursday, add pancakes to breakfast
    if (dayOfWeek === 4) {
      if (Breakfast_preferences?.Pancake) {
        meals[0].Pancake = "Add";
      } else {
        meals[0].Pancake = "none";
      }
    }

    // if it is Sunday or Wednesday, add bacon to breakfast
    if (dayOfWeek === 0 || dayOfWeek === 3) {
      if (Breakfast_preferences?.Bacon) {
        meals[0].Bacon = "Add";
      } else {
        meals[0].Bacon = "none";
      }
    }

    return { ...rest, meals };
  }
  });
}
