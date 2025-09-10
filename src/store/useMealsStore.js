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
          ? meals.filter(meal => meal?.onTray !== true && meal?.went_out_to_eat !== true)
          : []
      }
    })),
  updateMealItem: (type, documentId, updates) =>
    set((state) => ({
      meals: {
        ...state.meals,
        [type]: state.meals[type].map(meal =>
          meal.documentId === documentId
            ? { ...meal, ...updates }
            : meal
        )
      }
    }))
}))
