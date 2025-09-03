"use client";
import { useEffect, useMemo, useState } from "react";
import { ServingModal } from "./ServingModal";
import { MealBar } from "./MealBar";
import { TableMap } from "./TableMap";
import Title from "./Title";
import { useDayBreakfastStore } from "@/store/useDayBreakfastStore";
import { useSeatingConfigure } from "@/hooks/useSeatingConfigure";
import { useMealBar } from "@/hooks/useMealBar";
import { useResidentsStore } from "@/store/useResidentsStore";
import { useDayMenusStore } from "@/store/useDayMenusStore";
import { useFilterResidents } from "@/hooks/useFilterResidents";
import { useDayLunchStore } from "@/store/useDayLunchStore";
import { useDaySupperStore } from "@/store/useDaySupperStore";

export function Serving({ residents, date, breakFast, menus, lunch, supper }) {
  const [residentsOnSeating, setResidentsOnSeating] = useState(residents);
  const [meals, setMeals] = useState(breakFast);
  const [condition, setCondition] = useState("breakfast");
  const observations = ["The chair positions may not be correct"];

  // FUNCTION TO SET STORE RESIDENTS
  const setResidents = useResidentsStore((state) => state.setResidents);
  // FUCTION TO SET STORE MENUS
  const setDayMenus = useDayMenusStore((state) => state.setDayMenus)
  // FUNCTION TO SET STORE BREAKFAST
  const setDayBreakfast = useDayBreakfastStore((state) => state.setDayBreakfast);
  // FUNCTION TO SET STORE LUNCH
  const setDayLunch = useDayLunchStore((state) => state.setDayLunch);
  // FUNCTION TO SET STORE SUPPER
  const setDaySupper = useDaySupperStore((state) => state.setDayLunch);
;

  // useEffect to set the residents on the store every time the date changes
  // and the residents are updated
  useEffect(() => {
    async function storeData() {
      try {
        setResidents(residents);
      } catch (error) {
        console.error("Error", error);
      }
    }
    storeData();
  }, [date, residents, setResidents]);

    // UseEffect to update the menus on the store
  useEffect(() => {
    try {
      setDayMenus(menus);
    } catch (error) {
      console.error("Error", error);
    }
  }, [menus, setDayMenus]);

  // UseEffect to update the breakfast on the store
  useEffect(() => {
    try {
      setDayBreakfast(breakFast);
    } catch (error) {
      console.error("Error", error);
    }
  }, [breakFast]);

  // UseEffect to update the lunch on the store
  useEffect(() => {
    try {
      setDayLunch(lunch);
    } catch (error) {
      console.error("Error", error);
    }
  }, [lunch]);

  // UseEffect to update the supper on the store
  useEffect(() => {
    try {
      setDaySupper(supper);
    } catch (error) {
      console.error("Error", error);
    }
  }, [supper]);



  // to get the seating number
  const onSeating = useSeatingConfigure((state) => state.seating);
  // to get the meal number of the meal bar
  const mealNumber = useMealBar((state) => state.mealNumber);
  // to get the residents on the store
  const storeResidents = useResidentsStore((state) => state.residents);
  // to get the menus on the store
  const dayMenus = useDayMenusStore((state) => state.dayMenus);
  // to get the breakfast on the store
  const dayBreakfast = useDayBreakfastStore((state) => state.dayBreakfast);
  // to get the lunch on the store
  const dayLunch = useDayLunchStore((state) => state.dayLunch);
  // to get the supper on the store
  const daySupper = useDaySupperStore((state) => state.daySupper);

  // SORT RESIDENTS BY SEATING AND MEALS
  // to get the residents on the selected seating, with the meal number
  useEffect(() => {
    const result = useFilterResidents(storeResidents, onSeating, mealNumber);

    const sortedResidents = [...result].sort((a, b) => {
      const indexA = dayMenus.findIndex(
        (menu) => menu.resident?.documentId === a?.documentId
      );
      const indexB = dayMenus.findIndex(
        (menu) => menu.resident?.documentId === b?.documentId
      );
      return indexA - indexB;
    });

    setResidentsOnSeating((prev) => {
      const isEqual = JSON.stringify(prev) === JSON.stringify(sortedResidents);
      return isEqual ? prev : sortedResidents;
    });

    const sortedMeals = [...meals].sort((a, b) => {
      const indexA = dayMenus.findIndex(
        (menu) => menu[condition]?.documentId === a?.documentId
      );
      const indexB = dayMenus.findIndex(
        (menu) => menu[condition]?.documentId === b?.documentId
      );
      return indexA - indexB;
    });

    setMeals((prev) => {
      const isEqual = JSON.stringify(prev) === JSON.stringify(sortedMeals);
      return isEqual ? prev : sortedMeals;
    });
  }, [onSeating, mealNumber, storeResidents, dayMenus, meals, condition]);

  useEffect(() => {
    if (mealNumber === 0) {
      setCondition("breakfast");
      setMeals(dayBreakfast);
    } else if (mealNumber === 1) {
      setCondition("lunch");
      setMeals(dayLunch);
    } else if (mealNumber === 2) {
      setCondition("supper");
      setMeals(daySupper);
    } else {
      setCondition("breakfast");
      setMeals((prevMeals) =>
        Array.isArray(dayBreakfast) && dayBreakfast.every((item) => item)
          ? dayBreakfast
          : prevMeals
      );
    }
  }, [mealNumber, dayBreakfast, dayLunch, daySupper]);

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

  // Filter residents and meals who did not went_out_to_eat
  const filteredData = useMemo(() => {
    return filterAndSortData(
      residentsOnSeating,
      meals,
      (condition) => !condition?.went_out_to_eat
    );
  }, [residentsOnSeating, meals]);

  const filteredResidents = filteredData.primary;
  const filteredMeals = filteredData.secondary;

  return (
    <>
      <ServingModal
        residentsOnSeating={filteredResidents}
        dayMenus={dayMenus}
        meals={filteredMeals}
      />
      <MealBar />
      <TableMap meal={filteredMeals} />
      <Title observations={observations} className="mb-4" />
    </>
  );
}
