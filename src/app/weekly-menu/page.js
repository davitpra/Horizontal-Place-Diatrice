"use client";
import { useWeeklyMenuStore } from "@/store/meals/useWeeklyMenuStore";
import { WeeklyMenuSelected } from "@/components/features/weeklyMenu/WeeklyMenuSelected";
import { Wraper } from "@/components/ui/Wraper";
import { useResidentsStore } from "@/store/residents/useResidentsStore";
import ResidentSearch from "@/components/features/search/ResidentSearch";
import { getResidentWeeklyMenus } from "@/strapi/menus/getResidentWeeklyMenus";
import { useState, useEffect } from "react";
import { date } from "@/constants/date";
import { getMonthYearFromISO } from "@/utils/date";

export default function WeeklyMenuPage() {
  const weeklyMenu = useWeeklyMenuStore((state) => state.weeklyMenu);
  const residents = useResidentsStore((state) => state.residents);

  const [weeklyMenuSelected, setWeeklyMenuSelected] = useState(null);

  const { month, year } = getMonthYearFromISO(date);

  // Loading and error states are handled by InitialDataProvider
  const loading = false;
  const error = null;

  useEffect(() => {
    handleResidentSelect(residents[0]);
  }, []);
  // Handle resident selection
  const handleResidentSelect = async (resident) => {
    // Early return if no resident is selected (cleared search)
    if (!resident) {
      setWeeklyMenuSelected(null);
      return;
    }

    try {
      const menuData = await getResidentWeeklyMenus(resident.documentId);
      // Update the state with the fetched menu data
      setWeeklyMenuSelected(menuData);

      // Additional verification
      if (!menuData || menuData.length === 0) {
        console.warn("No menus found for this resident");
      }
    } catch (error) {
      console.error("Error fetching weekly menu:", error);
      setWeeklyMenuSelected([]);
    }
  };

  console.log("date", date);

  return (

    <Wraper>
      <h2 className="text-lg font-medium text-gray-900">{month} {year}</h2>
      <p className="text-sm text-gray-500">
        A calendar showing the weekly menu dates.
      </p>
      <p className="text-sm text-gray-500">
        Breakfast options are customizable — you can choose from different styles of eggs (over easy, scrambled, hard-boiled, poached, etc.) and types of toast (brown, white, raisin, rye, etc.). You can also add extras like yogurt, cereal, fruit, and more.
        If no breakfast selection has been made, it will be served according to the resident’s preferences.
      </p>
      <br />

      {/* Search Section */}
      <ResidentSearch
        residents={residents}
        onSelectResident={handleResidentSelect}
        label="Buscar menu por residente"
        placeholder="Buscar por nombre del residente..."
      />

      <WeeklyMenuSelected
        menuData={weeklyMenu}
        menuDataSelected={weeklyMenuSelected}
        loading={loading}
        error={error}
      />

    </Wraper>
  );
}