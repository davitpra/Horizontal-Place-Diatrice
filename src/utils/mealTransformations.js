import {
  MEAL_TYPE_BY_NUMBER,
  MEAL_TYPES,
  COMMON_ITEMS,
  BREAKFAST_ITEMS,
  LUNCH_SUPPER_ITEMS,
  MEAL_VALUES
} from '@/constants/mealConstants';

/**
 * Transform meal preferences into UI format based on meal type
 * @param {Object} preference - The meal preferences
 * @param {number} mealNumber - The meal number (0: breakfast, 1: lunch, 2: supper)
 * @param {Object} [menuData] - Optional menu data for lunch/supper (keys map to dish text)
 * @returns {Object} - Transformed preferences for UI
 */
export const transformOrder = (preference, mealNumber, menuData) => {
  // error handling
  if (!preference || typeof preference !== "object") {
    console.error("Invalid preference object");
    return {};
  }

  const mealType = MEAL_TYPE_BY_NUMBER[mealNumber];
  if (!mealType) {
    console.error("Invalid meal number");
    return {};
  }

  return Object.entries(preference).reduce((acc, [key, value]) => {
    // Handle common items
    if (Object.values(COMMON_ITEMS).includes(key)) {
      acc[key] = value === "" ? MEAL_VALUES.NONE : value;
      return acc;
    }

    // Handle breakfast specific items
    if (mealType === MEAL_TYPES.BREAKFAST) {
      if (Object.values(BREAKFAST_ITEMS).includes(key)) {
        acc[key] = value === true ? MEAL_VALUES.ADD : value === false ? MEAL_VALUES.NONE : value;
      } else {
        acc[key] = value === "" ? MEAL_VALUES.NONE : value;
      }
    }

    // Handle lunch and supper items
    if ([MEAL_TYPES.LUNCH, MEAL_TYPES.SUPPER].includes(mealType)) {
      if (Object.values(LUNCH_SUPPER_ITEMS).includes(key)) {
        if (value === true) {
          // Map boolean true to the actual menu item text when available
          const dishText = menuData && menuData[key];
          acc[key] = dishText ? dishText : MEAL_VALUES.ADD;
        } else if (value === false || value === "") {
          acc[key] = MEAL_VALUES.NONE;
        } else {
          // Already a string selection (e.g., actual dish name or 'none')
          acc[key] = value;
        }
      } else {
        acc[key] = value === "" ? MEAL_VALUES.NONE : value;
      }
    }

    return acc;
  }, {});
};

/**
 * Transform UI format back to meal preferences based on meal type
 * @param {Object} meals - The UI format meals
 * @param {number} mealNumber - The meal number (0: breakfast, 1: lunch, 2: supper)
 * @param {Object} [menuData] - Optional menu data for lunch/supper (keys map to dish text)
 * @returns {Object} - Transformed preferences for storage
 */
export const reverseTransformOrder = (meals, mealNumber, menuData) => {
  if (!meals || typeof meals !== "object") {
    console.error("Invalid meals object");
    return {};
  }

  const mealType = MEAL_TYPE_BY_NUMBER[mealNumber];
  if (!mealType) {
    console.error("Invalid meal number");
    return {};
  }

  return Object.entries(meals).reduce((acc, [key, value]) => {
    // Handle common items
    if (Object.values(COMMON_ITEMS).includes(key)) {
      acc[key] = value === MEAL_VALUES.NONE ? "" : value;
      return acc;
    }

    // Handle breakfast specific items
    if (mealType === MEAL_TYPES.BREAKFAST) {
      if (Object.values(BREAKFAST_ITEMS).includes(key)) {
        acc[key] = value === MEAL_VALUES.ADD ? true : value === MEAL_VALUES.NONE ? false : value;
      } else {
        acc[key] = value === MEAL_VALUES.NONE ? "" : value;
      }
    }

    // Handle lunch and supper items
    if ([MEAL_TYPES.LUNCH, MEAL_TYPES.SUPPER].includes(mealType)) {
      if (Object.values(LUNCH_SUPPER_ITEMS).includes(key)) {
        if (value === MEAL_VALUES.NONE || value === "") {
          acc[key] = false;
        } else {
          // Check if the value matches a menu item text
          const isMenuDish = menuData && menuData[key] === value;
          acc[key] = isMenuDish ? true : value;
        }
      } else {
        acc[key] = value === MEAL_VALUES.NONE ? "" : value;
      }
    }

    return acc;
  }, {});
};
