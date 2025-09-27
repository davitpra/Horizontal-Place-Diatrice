import { useDayMenusStore } from '@/store/meals/useDayMenusStore';
import { useResidentsStore } from '@/store/residents/useResidentsStore';
import { useState, useEffect, useMemo } from 'react';

export const useTrayFilters = ({
  meal,
  condition,
}) => {
  const residents = useResidentsStore((state) => state.residents);
  const menus = useDayMenusStore((state) => state.dayMenus);
  const [residentsOnTray, setResidentsOnTray] = useState([]);
  const [mealOnTray, setMealOnTray] = useState([]);

  // Filtrar menús, residentes y comidas que están en la bandeja
  useEffect(() => {
    // 1. Primero filtramos las comidas que están en la bandeja
    const mealsOnTray =
      meal?.filter((meal) => meal.onTray) || [];

    // 2. Luego filtramos los menús que tienen comidas en la bandeja
    const menusByTray =
      menus?.filter((menu) =>
        mealsOnTray.some(
          (meal) => meal?.documentId === menu?.[condition]?.documentId
        )
      ) || [];

    // 3. Filtramos los residentes basados en los menús de la bandeja
    const residentsInTray =
      residents?.filter((resident) =>
        menusByTray.some(
          (menu) => menu.resident?.documentId === resident.documentId
        )
      ) || [];

    setResidentsOnTray(residentsInTray);

    // 4. Aseguramos que las comidas estén en el mismo orden que los residentes en la bandeja
    const orderedMealsOnTray = residentsInTray
      .map((resident) => {
        const residentMenu = menusByTray.find(
          (menu) => menu.resident?.documentId === resident.documentId
        );
        const meal = mealsOnTray.find(
          (meal) => meal.documentId === residentMenu?.[condition]?.documentId
        );
       
        return meal;
      })
      .filter(Boolean);

    setMealOnTray(orderedMealsOnTray);
  }, [residents, meal, menus, condition]);

  console.log("mealOnTray useTrayFilters", mealOnTray);

  return {
    residentsOnTray,
    mealOnTray,
    setMealOnTray,
  };
};
