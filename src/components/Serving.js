"use client";
import { useEffect, useState } from "react";
import { ServingModal } from "./ServingModal";
import { MealBar } from "./MealBar";
import { TableMap } from "./TableMap";
import Title from "./Title";
import { useSeatingConfigure } from "@/hooks/useSeatingConfigure";
import { useMealBar } from "@/hooks/useMealBar";
import { useResidentsStore } from "@/store/useResidentsStore";
import { useDayMenusStore } from "@/store/useDayMenusStore";
import { useMealsStore } from "@/store/useMealsStore";
import { useMenuScheduleStore } from "@/store/useMenuScheduleStore";

export function Serving({ residents, date, breakFast, menus, lunch, supper, menuSchedule }) {
  // STATES
  const [currentMeals, setCurrentMeals] = useState(breakFast);
  const [residentsOnSeating, setResidentsOnSeating] = useState(residents);
  const [mealsOnSeating, setMealsOnSeating] = useState([]);
  const [menusOnSeating, setMenusOnSeating] = useState([]);
  const [condition, setCondition] = useState("breakfast");
  const observations = ["The chair positions may not be correct"];

  // FUNCTION TO SET STORE RESIDENTS
  const setResidents = useResidentsStore((state) => state.setResidents);
  // FUCTION TO SET STORE MENUS
  const setDayMenus = useDayMenusStore((state) => state.setDayMenus);
  // GET MEALS STORE FUNCTIONS
  const { setMeal, meals } = useMealsStore();
  // FUNCTION TO SET STORE MENU SCHEDULE
  const setMenuSchedule = useMenuScheduleStore((state) => state.setMenuSchedule);

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

  // useEffect to set the menu schedule on the store
  useEffect(() => {
    try {
      setMenuSchedule(menuSchedule);
      console.log("Menu Schedule set in store:", menuSchedule);
    } catch (error) {
      console.error("Error", error);
    }
  }, [menuSchedule]);

  // UseEffect to update the menus on the store
  useEffect(() => {
    try {
      setDayMenus(menus);
    } catch (error) {
      console.error("Error", error);
    }
  }, [menus, setDayMenus]);

  // UseEffect to update meals in the store
  useEffect(() => {
    try {
      setMeal('breakfast', breakFast);
      setMeal('lunch', lunch);
      setMeal('supper', supper);
    } catch (error) {
      console.error("Error updating meals:", error);
    }
  }, [breakFast, lunch, supper, setMeal]);

  // to get the seating number
  const onSeating = useSeatingConfigure((state) => state.seating);
  // to get the meal number of the meal bar
  const mealNumber = useMealBar((state) => state.mealNumber);
  // to get the residents on the store
  const storeResidents = useResidentsStore((state) => state.residents);
  // to get the menus on the store
  const dayMenus = useDayMenusStore((state) => state.dayMenus);

  // SET MEALS AND CONDITION BASED ON MEAL NUMBER
  useEffect(() => {
    const mealTypes = ['breakfast', 'lunch', 'supper'];
    const mealType = mealTypes[mealNumber] || 'breakfast';
    
    setCondition(mealType);
    setCurrentMeals(meals[mealType] || []);
  }, [mealNumber, meals]);

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

    const mealsBySeating = currentMeals.filter((meal) =>
      menusBySeating.some(
        (menu) => menu?.[condition]?.documentId === meal.documentId
      )
    );

    setMealsOnSeating(mealsBySeating);
  }, [residentsOnSeating, dayMenus, currentMeals, condition]);

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
