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
  const [updateMealOnTray, setUpdatedMealOnTray] = useState([]);

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

  // Filtrar las bebidas de los pedidos
  const ordersWithoutDrinks = useMemo(() => {
    const filterDrinks = (meals) => {
      const {
        water,
        Hotdrink,
        Juice,
        Cereals,
        Comment,
        ...filteredPreference
      } = meals;
      return filteredPreference;
    };

    try {
      if (!Array.isArray(mealOnTray)) {
        console.error("order is not an array:", mealOnTray);
        return [];
      }

      // Filtrar las bebidas de cada pedido
      return mealOnTray.map((preference) => {
        if (
          !preference ||
          !Array.isArray(preference.meals) ||
          !preference.meals[0]
        ) {
          console.error("Invalid preference object:", preference);
          return {};
        }
        const filteredMeals = filterDrinks(preference.meals[0]);
        return {
          filterDrinks: filteredMeals,
          complete: preference.complete,
          documentId: preference.documentId,
          onTray: preference.onTray,
          went_out_to_eat: preference.went_out_to_eat,
        };
      });
    } catch (error) {
      console.error("An error occurred while filtering order:", error);
      return [];
    }
  }, [mealOnTray]);

  useEffect(() => {
    setUpdatedMealOnTray(ordersWithoutDrinks);
  }, [ordersWithoutDrinks]);

  return {
    residentsOnTray,
    mealOnTray,
    updateMealOnTray,
    setMealOnTray,
  };
};
