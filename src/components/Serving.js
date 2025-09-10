"use client";
import { useEffect, useState } from "react";
import { ServingModal } from "./ServingModal";
import { MealBar } from "./MealBar";
import { TableMap } from "./TableMap";
import Title from "./Title";
import { useDayBreakfastStore } from "@/store/useDayBreakfastStore";
import { useSeatingConfigure } from "@/hooks/useSeatingConfigure";
import { useMealBar } from "@/hooks/useMealBar";
import { useResidentsStore } from "@/store/useResidentsStore";
import { useDayMenusStore } from "@/store/useDayMenusStore";
import { useDayLunchStore } from "@/store/useDayLunchStore";
import { useDaySupperStore } from "@/store/useDaySupperStore";

export function Serving({ residents, date, breakFast, menus, lunch, supper }) {
  // STATES
  const [meals, setMeals] = useState(breakFast);
  const [residentsOnSeating, setResidentsOnSeating] = useState(residents);
  const [mealsOnSeating, setMealsOnSeating] = useState([]);
  const [menusOnSeating, setMenusOnSeating] = useState([]);
  const [condition, setCondition] = useState("breakfast");
  const observations = ["The chair positions may not be correct"];

  // FUNCTION TO SET STORE RESIDENTS
  const setResidents = useResidentsStore((state) => state.setResidents);
  // FUCTION TO SET STORE MENUS
  const setDayMenus = useDayMenusStore((state) => state.setDayMenus);
  // FUNCTION TO SET STORE BREAKFAST
  const setDayBreakfast = useDayBreakfastStore(
    (state) => state.setDayBreakfast
  );
  // FUNCTION TO SET STORE LUNCH
  const setDayLunch = useDayLunchStore((state) => state.setDayLunch);
  // FUNCTION TO SET STORE SUPPER
  const setDaySupper = useDaySupperStore((state) => state.setDaySupper);

  // useEffect to set the residents on the store 
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
      const breakFastOnServing = breakFast.filter(
        (meal) => meal.onTray !== true && meal.went_out_to_eat !== true
      ); // Filter breakfast meals on tray and not went out to eat
      setDayBreakfast(breakFastOnServing);
    } catch (error) {
      console.error("Error", error);
    }
  }, [breakFast]);

  // UseEffect to update the lunch on the store
  useEffect(() => {
    try {
      const lunchOnServing = lunch.filter(
        (meal) => meal.onTray !== true && meal.went_out_to_eat !== true
      ); // Filter lunch meals on tray and not went out to eat
      setDayLunch(lunchOnServing);
    } catch (error) {
      console.error("Error", error);
    }
  }, [lunch]);

  // UseEffect to update the supper on the store
  useEffect(() => {
    try {
      const supperOnServing = supper.filter(
        (meal) => meal.onTray !== true && meal.went_out_to_eat !== true
      ); // Filter supper meals on tray and not went out to eat
      setDaySupper(supperOnServing);
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

  // SET MEALS AND CONDITION BASED ON MEAL NUMBER
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

  // FILTER RESIDENTS BY SEATING  
  useEffect(() => {
    const residentsBySeating = storeResidents.filter(
      (person) => person.Seating === onSeating
    );
    setResidentsOnSeating(residentsBySeating);
  }, [storeResidents, onSeating]);

  // FILTER MEALS BY SEATING AND MEAL NUMBER
  useEffect(() => {
    const menusBySeating = dayMenus.filter((menu) =>
      residentsOnSeating.some(
        (resident) => resident.documentId === menu.resident?.documentId
      )
    );

    setMenusOnSeating(menusBySeating);

    const mealsBySeating = meals.filter((meal) =>
      menusBySeating.some(
        (menu) => menu?.[condition]?.documentId === meal.documentId
      )
    );

    setMealsOnSeating(mealsBySeating);
  }, [residentsOnSeating, dayMenus, meals, condition]);

  return (
    <>
      <ServingModal
        residentsOnSeating={residentsOnSeating}
        menusOnSeating={menusOnSeating}
        mealsOnSeating={mealsOnSeating}
        condition={condition}
      />
      <MealBar />
      <TableMap meal={mealsOnSeating} />
      <Title observations={observations} className="mb-4" />
    </>
  );
}
