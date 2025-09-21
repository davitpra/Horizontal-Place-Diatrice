import { MEAL_OPTIONS } from "@/constants/mealOption";

export const calculateMealStats = (rawMeals, menuOptions, mealNumber) => {
  if (!rawMeals?.length) return [];
  
  const currentMenuOptions = MEAL_OPTIONS[mealNumber];
  
  // Filter out drink options 
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
    // If the item has a value in menuOptions, use that
    if (menuOptions[item.key]) {
    return [{
      key: item.key,
      description: menuOptions[item.key] || "No option available",
    }];
    }

    // Filter out 'none' options and map the rest
    return item.options
      .filter(option => option !== "none")
      .map((option) => {
        // For boolean items (like Bacon) or items with Add option
        if (option === "Add") {
          return {
            key: item.key,
            description: "true",
            isBoolean: true
          }
        } else {
          return {
            key: item.key,
            description: option,
            isBoolean: false
          }
        }
      })
  });

  // Initialize statistics object based on LUNCH array
  const mealPreferences = [];

  // create an unique array of preferences based on the menu options
  combinedMenu.forEach((menuArray) => {
    menuArray.forEach(({ key, description, isBoolean }) => {
        // Create a unique identifier
        const uniqueKey = isBoolean ? `${key}-${key}` : `${key}-${description}`;
        mealPreferences.push({
          uniqueKey,
          key,
          description: isBoolean ? key : description,
          completed: 0,
          total: 0,
        });
    });
  });

  // Count preferences
  rawMeals.forEach((meal) => {
    combinedMenu.forEach((menuArray) => {
      menuArray.forEach(({ key, description, isBoolean }) => {
        const value = meal[key];
        let matches = false;

        if (isBoolean) {
          // For boolean values (like Bacon)
          matches = value === true;
        } else {
          // For regular string values
          matches = value === description;
        }

        if (matches) {
          const uniqueKey = isBoolean ? `${key}-${key}` : `${key}-${description}`;
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
