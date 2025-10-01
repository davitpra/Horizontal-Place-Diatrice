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
      
      // Extract top-level flags that must live outside of meals[0]
      const {
        onTray: incomingOnTray,
        tray: incomingTray, // allow alternative key name "tray"
        went_out_to_eat: incomingWentOutToEat,
        complete: incomingComplete,
        ...restUpdates
      } = updates || {};

      let updatedMeals;
      if (mealExists) {
        // Update existing meal
        updatedMeals = state.meals[type].map(meal => {
          if (meal.documentId === documentId) {
            // Merge updates into the nested meals[0] object, not the top-level meal
            const existingMealsArray = Array.isArray(meal.meals) ? meal.meals : [];
            const existingFirstMeal = existingMealsArray[0] || {};
            const mergedFirstMeal = { ...existingFirstMeal, ...restUpdates };

            return {
              ...meal,
              meals: [mergedFirstMeal],
              // Only override if these flags are present in the incoming updates
              ...(incomingOnTray !== undefined || incomingTray !== undefined
                ? { onTray: incomingOnTray ?? incomingTray }
                : {}),
              ...(incomingWentOutToEat !== undefined
                ? { went_out_to_eat: incomingWentOutToEat }
                : {}),
              ...(incomingComplete !== undefined
                ? { complete: incomingComplete }
                : {}),
            };
          }
          return meal;
        });
      } else {
        // Add new meal with documentId and meals array containing updates
        updatedMeals = [...state.meals[type], { 
          documentId, 
          meals: [restUpdates],
          complete: incomingComplete ?? true,
          onTray: (incomingOnTray ?? incomingTray) ?? true,
          went_out_to_eat: incomingWentOutToEat ?? false
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
