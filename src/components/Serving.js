'use client'
import { useEffect, useState } from "react";
import { ServingModal } from "./ServingModal";
import { MealBar } from "./MealBar";
import { TableMap } from "./TableMap";
import Title from "./Title";
import { useDayBreakfastStore } from "@/store/useDayBreakfastStore";
import { useSeatingConfigure } from "@/hooks/useSeatingConfigure";
import { useMealBar } from "@/hooks/useMealBar";
import { useSortedResidents } from "@/hooks/useSortedResidents";
import { useResidentsOnSeating } from "@/store/useResidentsOnSeating";

export function Serving({residents, date, breakFast}) {
  const setResidentsOnSeating = useResidentsOnSeating((state) => state.setResidents);
  const setDayBreakfast = useDayBreakfastStore((state) => state.setDayBreakfast);
  useEffect(() => {
    async function storeData() {
      try {
        setResidentsOnSeating(residents);
        setDayBreakfast(breakFast);
      } catch (error) {
        console.error("Error", error);
      }
    }
    storeData();
  }, [date, residents]);
    
  const observations = ["The chair positions may not be correct"];

  // SORT RESIDENTS BY SEATING AND MEALS
    // to get the seating number
    const onSeating = useSeatingConfigure((state) => state.seating);
    // to get the meal number of the meal bar
    const mealNumber = useMealBar((state) => state.mealNumber);
    // filter the residents by seating

    useEffect(() => {
      // to get the residents on the selected seating
      const residentsOnSeating = useSortedResidents(residents, onSeating, mealNumber);
      setResidentsOnSeating(residentsOnSeating);
    }, [onSeating, mealNumber]);

  return (
    <>
      <ServingModal/>
      <MealBar />
      <TableMap />
      <Title observations={observations} className="mb-4" />
    </>
  );
}

