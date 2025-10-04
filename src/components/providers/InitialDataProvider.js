"use client";
import { useEffect, useState } from "react";
import { getAllResidents } from "@/strapi/residents/getAllResidents";
import { residents as rawData } from "@/data/residents";
import { useCreateMenus } from "@/hooks/meals/useCreateMenus";
import { useCreateBreakfast } from "@/hooks/meals/useCreateBreakfast";
import { useCreateLunch } from "@/hooks/meals/useCreateLunch";
import { useCreateSupper } from "@/hooks/meals/useCreateSupper";
import { date } from "@/constants/date";
import { getMenuSchedule } from "@/strapi/menuSchedule/getMenuSchedule";
import { useMealsStore } from "@/store/meals/useMealsStore";
import { useResidentsStore } from "@/store/residents/useResidentsStore";
import { useDayMenusStore } from "@/store/meals/useDayMenusStore";
import { useMenuScheduleStore } from "@/store/meals/useMenuScheduleStore";
import { Loading } from "@/components/ui/Loading";

export function InitialDataProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Get store setters
  const setMeal = useMealsStore((state) => state.setMeal);
  const setResidents = useResidentsStore((state) => state.setResidents);
  const setDayMenus = useDayMenusStore((state) => state.setDayMenus);
  const setMenuSchedule = useMenuScheduleStore((state) => state.setMenuSchedule);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        
        // Get all initial data
        const residents = await getAllResidents();
        const menus = await useCreateMenus(residents, date);
        const menuSchedule = await getMenuSchedule(date);
        const breakFast = await useCreateBreakfast(residents, date, menus);
        const lunch = await useCreateLunch(residents, date, menus);
        const supper = await useCreateSupper(residents, date, menus);

        // Update all stores
        setResidents(residents);
        setDayMenus(menus);
        setMenuSchedule(menuSchedule);
        setMeal('breakfast', breakFast);
        setMeal('lunch', lunch);
        setMeal('supper', supper);

      } catch (error) {
        console.error("Error loading initial data:", error);
        // Set fallback data if available
        setResidents(rawData);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, [setResidents, setDayMenus, setMenuSchedule, setMeal]);

  if (isLoading) {
    return <Loading message="Loading initial data..." />;
  }

  return children;
}
