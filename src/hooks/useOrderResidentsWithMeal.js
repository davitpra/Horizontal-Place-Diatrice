import { useState, useEffect } from "react";
import { useDayMenusStore } from "../store/useDayMenusStore";

export const useOrderResidentsWithMeal = (residents, meals, mealNumber) => {
  // const [orderedResidents, setOrderedResidents] = useState(residents);
  // const [orderedMeals, setOrderedMeals] = useState(meals);

  const dayMenus = useDayMenusStore((state) => state.dayMenus);

  // Ordenar residentes
  const sortedResidents = [...residents].sort((a, b) => {
    const indexA = dayMenus.findIndex(
      (menu) => menu.resident?.documentId === a?.documentId
    );
    const indexB = dayMenus.findIndex(
      (menu) => menu.resident?.documentId === b?.documentId
    );
    return indexA - indexB;
  });

  // Determinar la condición según el número de comida
  let condition;
  if (mealNumber === 0) {
    condition = "breakfast";
  } else if (mealNumber === 1) {
    condition = "lunch";
  } else if (mealNumber === 2) {
    condition = "dinner";
  } else {
    condition = "breakfast";
  }

  // Ordenar comidas
  const sortedMeals = [...meals].sort((a, b) => {
    const indexA = dayMenus.findIndex(
      (menu) => menu[condition]?.documentId === a?.documentId
    );
    const indexB = dayMenus.findIndex(
      (menu) => menu[condition]?.documentId === b?.documentId
    );
    return indexA - indexB;
  });

  // Filtrar y ordenar datos
  function filterAndSortData(primaryArray, secondaryArray, filterCondition) {
    return primaryArray.reduce(
      (acc, primaryItem, index) => {
        const correspondingItem = secondaryArray[index];
        if (filterCondition(correspondingItem)) {
          acc.primary.push(primaryItem);
          acc.secondary.push(correspondingItem);
        }
        return acc;
      },
      { primary: [], secondary: [] }
    );
  }

  const filteredData = filterAndSortData(
    sortedResidents,
    sortedMeals,
    (condition) => !condition?.went_out_to_eat
  );

  const filteredResidents = filteredData.primary;
  const filteredMeals = filteredData.secondary;

  return { filteredResidents, filteredMeals };
};
