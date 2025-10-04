"use client";
import { useEffect, useState } from "react";
import { ServingModal } from "@/components/features/servingModals/ServingModal";
import { MealBar } from "@/components/ui/MealBar";
import { TableMap } from "@/components/features/serving/TableMap";
import Title from "@/components/ui/Title";
import { useSeatingConfigure } from "@/store/seating/useSeatingConfigure";
import { useMealBar } from "@/store/mealBar/useMealBar";
import { useMealsStore } from "@/store/meals/useMealsStore";
import { useSeatingFilters } from "@/hooks/utils/useSeatingFilters";
import AuthGuard from "@/components/auth/AuthGuard";

const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  SUPPER: 'supper'
};

const MEAL_TYPE_BY_NUMBER = [
  MEAL_TYPES.BREAKFAST,
  MEAL_TYPES.LUNCH,
  MEAL_TYPES.SUPPER
];

export default function Serving() {
  // Get data from stores
  const { meals } = useMealsStore();
  
  // Get UI state from stores
  const selectedSeating = useSeatingConfigure((state) => state.seating);
  const selectedMealNumber = useMealBar((state) => state.mealNumber);

  // Local state
  const [currentMealType, setCurrentMealType] = useState(MEAL_TYPES.BREAKFAST);
  const [currentMeals, setCurrentMeals] = useState(meals[MEAL_TYPES.BREAKFAST]);

  // Get filtered data based on seating
  const { residentsInSeating, menusInSeating, mealsInSeating } = useSeatingFilters({
    meals: currentMeals,
    selectedSeating,
    currentMealType,
  });

  // Update current meal type and meals when meal number changes
  useEffect(() => {
    const newMealType = MEAL_TYPE_BY_NUMBER[selectedMealNumber] || MEAL_TYPES.BREAKFAST;
    setCurrentMealType(newMealType);
    setCurrentMeals(meals[newMealType] || []);
  }, [selectedMealNumber, meals]);

  return (
    <>
    <AuthGuard>
      <ServingModal
        residentsOnSeating={residentsInSeating}
        menusOnSeating={menusInSeating}
        mealsOnSeating={mealsInSeating}
        condition={currentMealType}
      />
      <MealBar />
      <TableMap meal={mealsInSeating} />
      <Title 
        observations={["The chair positions may not be correct"]} 
        className="mb-4" 
      />
    </AuthGuard>
    </>
  );
}