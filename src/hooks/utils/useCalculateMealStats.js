import { MEAL_OPTIONS } from "@/constants/mealOption";

export const useCalculateMealStats = (rawMeals, menuOptions) => {
  const LUNCH = MEAL_OPTIONS[1]; // LUNCH es el segundo elemento del array

  // Filter out drink options from LUNCH for meal preference statistics
  const LUNCH_WITHOUT_DRINKS = LUNCH.filter(
    (item) =>
      ![
        "water",
        "Hotdrink",
        "Juice",
        "Milk",
        "additionals",
        "Comment",
      ].includes(item.key)
  );

  const combinedMenu = LUNCH_WITHOUT_DRINKS.map(item => {
    return {
      key: item.key,
      description: menuOptions[item.key] || "No option available"
    };
  });

  if (!rawMeals?.length) return [];

  // Initialize statistics object based on LUNCH array
  const mealPreferences = {};

  combinedMenu.forEach(({ key, description }) => {
    // Initialize the preference counter for this key
    mealPreferences[key] = {
      description: description,
      completed: 0,
      total: 0,
    };
  });

  // Count preferences
  rawMeals.forEach((meal) => {
    combinedMenu.forEach(({ key }) => {
      const value = meal[key];
      if (value && value !== "none") {
        mealPreferences[key].total += 1;
        // A meal is completed if it has a specific option selected and meal is complete
        if (value !== "" && meal.complete) {
          mealPreferences[key].completed += 1;
        }
      }
    });
  });

  // Convert to array format for table
  return Object.entries(mealPreferences).map(([preference, stats]) => ({
    preference,
    description: stats.description,
    totalAmount: stats.total,
    completed: stats.completed,
    toComplete: stats.total - stats.completed,
  }));
};
