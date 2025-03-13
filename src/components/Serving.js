"use client";
import { useEffect, useState } from "react";
import { ServingModal } from "./ServingModal";
import { MealBar } from "./MealBar";
import { TableMap } from "./TableMap";
import Title from "./Title";
import { useDayBreakfastStore } from "@/store/useDayBreakfastStore";
import { useSeatingConfigure } from "@/hooks/useSeatingConfigure";
import { useMealBar } from "@/hooks/useMealBar";
import { useSortedResidents } from "@/hooks/useSortedResidents";
import { useResidentsStore } from "@/store/useResidentsStore";

export function Serving({ residents, date, breakFast }) {
  const [residentsOnSeating, setResidentsOnSeating] = useState([]);

  // SET STORE RESIDENTS AND BREAKFAST
  const setResidents = useResidentsStore((state) => state.setResidents);

  useEffect(() => {
    async function storeData() {
      try {
        console.log("residents on serving", residents);
        setResidents(residents);
        // TODO ACTUALIZAR BREAKFAST EN EL STORE: useDayBreakfastStore
      } catch (error) {
        console.error("Error", error);
      }
    }
    storeData();
  }, [date, residents, setResidents]);

  const observations = ["The chair positions may not be correct"];

  // SORT RESIDENTS BY SEATING AND MEALS

  // to get the seating number
  const onSeating = useSeatingConfigure((state) => state.seating);
  // to get the meal number of the meal bar
  const mealNumber = useMealBar((state) => state.mealNumber);
  // filter the residents by seating
  const storeResidents = useResidentsStore((state) => state.residents)

  console.log(storeResidents, "storeResidents");

  useEffect(() => {
    // to get the residents on the selected seating
    const result = useSortedResidents(storeResidents, onSeating, mealNumber);
    setResidentsOnSeating(result);
  }, [onSeating, mealNumber, storeResidents]);


  console.log(residentsOnSeating, "residentsOnSeating");

  return (
    <>
      <ServingModal residentsOnSeating={residentsOnSeating} />
      <MealBar />
      <TableMap residentsOnSeating={residentsOnSeating} />
      <Title observations={observations} className="mb-4" />
    </>
  );
}
