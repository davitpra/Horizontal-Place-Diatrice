"use client";
import { useEffect, useMemo, useState } from "react";
import { ServingModal } from "./ServingModal";
import { MealBar } from "./MealBar";
import { TableMap } from "./TableMap";
import Title from "./Title";
import { useDayBreakfastStore } from "@/store/useDayBreakfastStore";
import { useSeatingConfigure } from "@/hooks/useSeatingConfigure";
import { useMealBar } from "@/hooks/useMealBar";
import { useSortedResidents } from "@/hooks/useSortedResidents";
import { useResidentsStore } from "@/store/useResidentsStore";
import { useDayMenusStore } from "@/store/useDayMenusStore";

export function Serving({ residents, date, breakFast, menus }) {
  const [residentsOnSeating, setResidentsOnSeating] = useState([]);
  const observations = ["The chair positions may not be correct"];


  // SET STORE RESIDENTS
  const setResidents = useResidentsStore((state) => state.setResidents);

  // useEffect to set the residents on the store every time the date changes
  // and the residents are updated
  useEffect(() => {
    async function storeData() {
      try {
        // console.log("residents on serving", residents);
        setResidents(residents);
      } catch (error) {
        console.error("Error", error);
      }
    }
    storeData();
  }, [date, residents, setResidents]);

  // SET STORE BREAKFAST
  const setDayBreakfast = useDayBreakfastStore(
    (state) => state.setDayBreakfast
  );
  // UseEffect to update the breakfast on the store
  useEffect(() => {
    async function storeData() {
      try {
        setDayBreakfast(breakFast);
      } catch (error) {
        console.error("Error", error);
      }
    }
    storeData();
  }, [breakFast, setDayBreakfast]);

  // SET STORE MENUS
  const setDayMenus = useDayMenusStore((state) => state.setDayMenus);

  // UseEffect to update the menus on the store
  useEffect(() => {
    async function storeData() {
      try {
        setDayMenus(menus);
      } catch (error) {
        console.error("Error", error);
      }
    }
    storeData();
  }, [menus, setDayMenus]);



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


  // SORT RESIDENTS BY SEATING AND MEALS
  // to get the residents on the selected seating, with the meal number
  useEffect(() => {
    // to get the residents on the selected seating and meal number
    const result = useSortedResidents(storeResidents, onSeating, mealNumber);
    setResidentsOnSeating(result);
  }, [onSeating, mealNumber, storeResidents]);


  // to sort the residents on the seating by menu order
  const sortedResidents = [...residentsOnSeating].sort((a, b) => {
    const indexA = dayMenus.findIndex(
      (menu) => menu.resident.documentId === a.documentId
    );
    const indexB = dayMenus.findIndex(
      (menu) => menu.resident.documentId === b.documentId
    );
    return indexA - indexB;
  });

  // to sort the breakfasts on the seating by menu order
  const sortedBreakfasts = [...dayBreakfast].sort((a, b) => {
    const indexA = dayMenus.findIndex(
      (menu) => menu.breakfast.documentId === a.documentId
    );
    const indexB = dayMenus.findIndex(
      (menu) => menu.breakfast.documentId === b.documentId
    );
    return indexA - indexB;
  });


  return (
    <>
      <ServingModal residentsOnSeating={sortedResidents} dayMenus = {dayMenus} dayBreakfast={sortedBreakfasts}/>
      <MealBar />
      <TableMap residentsOnSeating={sortedResidents} />
      <Title observations={observations} className="mb-4" />
    </>
  );
}
