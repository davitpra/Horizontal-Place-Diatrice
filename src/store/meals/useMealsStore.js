import { create } from 'zustand'

export const useMealsStore = create((set) => ({
  meals: {
    breakfast: [],
    lunch: [],
    supper: []
  },
  setMeal: (type, meals) => 
    set((state) => ({
      meals: {
        ...state.meals,
        [type]: Array.isArray(meals) 
          ? meals
          : []
      }
    })),
  updateMealItem: (type, documentId, updates) =>
    set((state) => {
      // Check if the meal with documentId exists
      const mealExists = state.meals[type].some(meal => meal.documentId === documentId);
      
      let updatedMeals;
      if (mealExists) {
        // Update existing meal
        updatedMeals = state.meals[type].map(meal => {
          if (meal.documentId === documentId) {
            // Create a new meal object with existing properties and update specific fields
            return {
              ...meal,
              ...updates
            };
          }
          return meal;
        });
      } else {
        // Add new meal with documentId and meals array containing updates
        updatedMeals = [...state.meals[type], { 
          documentId, 
          meals: [updates],
          complete: true,
          onTray: true,
          went_out_to_eat: false
        }];
      }
      
      
      return {
        meals: {
          ...state.meals,
          [type]: updatedMeals
        }
      };
    })
}))
