import { useState, useEffect, useMemo } from 'react';

export const useTableFilters = ({
  selectTable,
  residentsOnSeating,
  mealsOnSeating,
  menusOnSeating,
  condition,
}) => {
  const [residentsOnTable, setResidentsOnTable] = useState([]);
  const [mealOnTable, setMealOnTable] = useState([]);
  const [updateMealOnTable, setUpdatedMealOnTable] = useState([]);

  // Filtrar menús, residentes y comidas por mesa seleccionada
  useEffect(() => {
    // 1. Primero filtramos las comidas por mesa y si no hay mesa seleccionada, filtramos todas las comidas
    const mealsByTable =
      mealsOnSeating?.filter((meal) => {
        if (selectTable) {
          return meal.table === selectTable
        } else {
          return meal
        }}
      ) || [];
    // 2. Luego filtramos los menús que tienen comidas en esta mesa
    const menusByTable =
      menusOnSeating?.filter((menu) =>
        mealsByTable.some(
          (meal) => meal?.documentId === menu?.[condition]?.documentId
        )
      ) || [];

    // 3. Filtramos los residentes basados en los menús de la mesa
    const residentsInTable =
      residentsOnSeating?.filter((resident) =>
        menusByTable.some(
          (menu) => menu.resident.documentId === resident.documentId
        )
      ) || [];

    setResidentsOnTable(residentsInTable);

    // 4. Aseguramos que las comidas estén en el mismo orden que los residentes
    const orderedMealsByTable = residentsInTable
      .map((resident) => {
        const residentMenu = menusByTable.find(
          (menu) => menu.resident.documentId === resident.documentId
        );
        const meal = mealsByTable.find(
          (meal) => meal.documentId === residentMenu?.[condition]?.documentId
        );
       
        return meal;
      })
      .filter(Boolean);

    setMealOnTable(orderedMealsByTable);
  }, [selectTable, residentsOnSeating, mealsOnSeating, menusOnSeating, condition]);

  // Filtrar las bebidas de los pedidos
  const ordersWithoutDrinks = useMemo(() => {
    const filterDrinks = (meals) => {
      const {
        water,
        Hotdrink,
        Juice,
        Cereals,
        ...filteredPreference
      } = meals;
      return filteredPreference;
    };

    try {
      if (!Array.isArray(mealOnTable)) {
        console.error("order is not an array:", mealOnTable);
        return [];
      }

      // Filtrar las bebidas de cada pedido
      return mealOnTable.map((preference) => {
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
  }, [mealOnTable]);

  // Remove this useEffect and set directly in useMemo
  useEffect(() => {
    if (ordersWithoutDrinks.length > 0 || mealOnTable.length === 0) {
      setUpdatedMealOnTable(ordersWithoutDrinks);
    }
  }, [ordersWithoutDrinks, mealOnTable.length]);

  return {
    residentsOnTable,
    mealOnTable,
    updateMealOnTable,
    setMealOnTable,
  };
};
