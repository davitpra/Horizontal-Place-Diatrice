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
        "Cereals",
        "Yogurt",
        "Muffing",
      ].includes(item.key)
  );

  if (!rawMeals?.length) return [];

  const combinedMenu = MENUOPTIONS_WITHOUT_DRINKS.map((item) => {

    if (menuOptions[item.key]) {
    return [{
      key: item.key,
      description: menuOptions[item.key] || "No option available",
    }];
    }

    return item.options
      .filter(option => option !== "none")
      .map((option) => {
        if (option === "Add") {
          return {
            key: item.key,
            description: item.key,
          }
        } else {
          return {
            key: item.key,
            description: option,
          }
        }
      })
  });

  // Initialize statistics object based on LUNCH array
  const mealPreferences = [];

  combinedMenu.forEach((menuArray) => {
    menuArray.forEach(({ key, description }) => {
        // Create a unique identifier by combining key and description
        const uniqueKey = `${key}-${description}`;
        mealPreferences.push({
          uniqueKey,
          key,
          description,
          completed: 0,
          total: 0,
        });
    });
  });

  // Count preferences
  rawMeals.forEach((meal) => {
    combinedMenu.forEach((menuArray) => {
      menuArray.forEach(({ key, description }) => {
        const value = meal[key];
        if (value === description) {
          const uniqueKey = `${key}-${description}`;
          const preference = mealPreferences.find((p) => p.uniqueKey === uniqueKey);
          if (preference) {
            preference.total += 1;
            // A meal is completed if it has a specific option selected and meal is complete
            if (meal.complete) {
              preference.completed += 1;
            }
          }
        }
      });
    });
  });

  // Convert to array format for table
  return mealPreferences.map(({ uniqueKey, key, description, completed, total }) => ({
    id: uniqueKey, // Add unique key for React rendering
    preference: key,
    description,
    totalAmount: total,
    completed,
    toComplete: total - completed,
  }));
};
