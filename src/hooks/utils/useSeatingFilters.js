import { useMemo } from "react";
import { useResidentsStore } from "@/store/residents/useResidentsStore";
import { useDayMenusStore } from "@/store/meals/useDayMenusStore";

export const useSeatingFilters = ({
  meals,
  selectedSeating,
  currentMealType,
}) => {
  const residents = useResidentsStore((state) => state.residents);
  const menus = useDayMenusStore((state) => state.dayMenus);

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
    meals.filter(meal =>
      menusInSeating.some(
        menu => menu?.[currentMealType]?.documentId === meal.documentId
      )
    ),
    [meals, menusInSeating, currentMealType]
  );

  return {
    residentsInSeating,
    menusInSeating,
    mealsInSeating,
  };
};
