"use client";
import { useWeeklyMenuStore } from "@/store/meals/useWeeklyMenuStore";
import WeeklyMenuGrid from "@/components/features/weeklyMenu/WeeklyMenuGrid";
import { Wraper } from "@/components/ui/Wraper";
import { useResidentsStore } from "@/store/residents/useResidentsStore";
import ResidentSearch from "@/components/features/search/ResidentSearch";
import { getResidentWeeklyMenus } from "@/strapi/menus/getResidentWeeklyMenus";
import { useState, useEffect } from "react";

export default function WeeklyMenuPage() {
  const weeklyMenu = useWeeklyMenuStore((state) => state.weeklyMenu);
  const residents = useResidentsStore((state) => state.residents);

  const [weeklyMenuSelected, setWeeklyMenuSelected] = useState(null);
  
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

  return (

      <Wraper>
        <h2 className="text-lg font-medium text-gray-900">September 2025</h2>
        <p className="text-sm text-gray-500">Un calendario con las fechas de los menus de la semana, los desayunos son opcionales a elegir</p>
        <br />
        
        {/* Search Section */}
        <ResidentSearch
          residents={residents}
          onSelectResident={handleResidentSelect}
          label="Buscar menu por residente"
          placeholder="Buscar por nombre del residente..."
        />

        <WeeklyMenuGrid
          menuData={weeklyMenu}
          menuDataSelected={weeklyMenuSelected}
          loading={loading}
          error={error}
        />

      </Wraper>
  );
}