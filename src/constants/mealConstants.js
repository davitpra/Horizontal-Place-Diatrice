// Constants for meal types
export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  SUPPER: 'supper'
};

export const MEAL_TYPE_BY_NUMBER = [
  MEAL_TYPES.BREAKFAST,
  MEAL_TYPES.LUNCH,
  MEAL_TYPES.SUPPER
];

// Constants for meal items
export const BREAKFAST_ITEMS = {
  FRUIT_PLATE: 'FruitPlate',
  YOGURT: 'Yogurt',
  MUFFIN: 'Muffing',
};

export const LUNCH_SUPPER_ITEMS = {
  SOUP: 'soup',
  SALAD: 'salad',
  OPTION_1: 'option_1',
  OPTION_2: 'option_2',
  SIDE_1: 'side_1',
  SIDE_2: 'side_2',
  SIDE_3: 'side_3',
  SIDE_4: 'side_4',
  DESSERT: 'dessert'
};

export const COMMON_ITEMS = {
  WATER: 'water',
  HOT_DRINK: 'Hotdrink',
  JUICE: 'Juice',
  MILK: 'Milk',
  ADDITIONALS: 'additionals',
  COMMENT: 'Comment'
};

// Common values
export const MEAL_VALUES = {
  ADD: 'Add',
  NONE: 'none'
};

// Week days constants
export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DAY_NAMES_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Meal sections configuration for weekly menu grid
export const MEAL_SECTIONS = {
  Breakfast: ['feature'],
  Lunch: ['soup', 'salad', 'option_1', 'option_2', 'dessert'],
  Supper: ['option_1', 'option_2', 'side_1', 'side_2', 'side_3', 'side_4']
};
