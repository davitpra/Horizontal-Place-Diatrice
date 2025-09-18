import { MEAL_OPTIONS } from "@/constants/mealOption";

export const calculateMealStats = (rawMeals, menuOptions, mealNumber) => {
  if (!rawMeals?.length) return [];
  
  const currentMenuOptions = MEAL_OPTIONS[mealNumber];
  
  // Filter out drink options from LUNCH for meal preference statistics
  const MENUOPTIONS_WITHOUT_DRINKS = currentMenuOptions.filter(
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

  if (!rawMeals?.length) return [];

  console.log('-----------> MENUOPTIONS_WITHOUT_DRINKS', MENUOPTIONS_WITHOUT_DRINKS);

  const combinedMenu = MENUOPTIONS_WITHOUT_DRINKS.map((item) => {
    return {
      key: item.key,
      description: menuOptions[item.key] || "No option available",
    };
  });

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
