"use client";
import { useEffect, useState, useMemo } from "react";
import { ServingModal } from "@/components/features/servingModals/ServingModal";
import { MealBar } from "@/components/ui/MealBar";
import { TableMap } from "@/components/features/serving/TableMap";
import Title from "@/components/ui/Title";
import { useSeatingConfigure } from "@/store/seating/useSeatingConfigure";
import { useMealBar } from "@/store/mealBar/useMealBar";
import { useResidentsStore } from "@/store/residents/useResidentsStore";
import { useDayMenusStore } from "@/store/meals/useDayMenusStore";
import { useMealsStore } from "@/store/meals/useMealsStore";

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

export function Serving() {
  // Get data from stores
  const { meals } = useMealsStore();
  const residents = useResidentsStore((state) => state.residents);
  const menus = useDayMenusStore((state) => state.dayMenus);
  
  // Get UI state from stores
  const selectedSeating = useSeatingConfigure((state) => state.seating);
  const selectedMealNumber = useMealBar((state) => state.mealNumber);

  // Local state
  const [currentMealType, setCurrentMealType] = useState(MEAL_TYPES.BREAKFAST);
  const [currentMeals, setCurrentMeals] = useState(meals[MEAL_TYPES.BREAKFAST]);

  // Filter residents by seating
  const residentsInSeating = useMemo(() => 
    residents.filter(person => person.Seating === selectedSeating),
    [residents, selectedSeating]
  );

  // Filter menus by residents in seating
  const menusInSeating = useMemo(() => 
    menus.filter(menu => 
      residentsInSeating.some(
        resident => resident.documentId === menu.resident?.documentId
      )
    ),
    [menus, residentsInSeating]
  );

  // Filter meals by menus in seating
  const mealsInSeating = useMemo(() => 
    currentMeals.filter(meal =>
      menusInSeating.some(
        menu => menu?.[currentMealType]?.documentId === meal.documentId
      )
    ),
    [currentMeals, menusInSeating, currentMealType]
  );

  // Update current meal type and meals when meal number changes
  useEffect(() => {
    const newMealType = MEAL_TYPE_BY_NUMBER[selectedMealNumber] || MEAL_TYPES.BREAKFAST;
    setCurrentMealType(newMealType);
    setCurrentMeals(meals[newMealType] || []);
  }, [selectedMealNumber, meals]);

  return (
    <>
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
    </>
  );
}