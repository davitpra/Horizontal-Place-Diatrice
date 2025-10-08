"use client";
import { useWeeklyMenuStore } from "@/store/meals/useWeeklyMenuStore";
import WeeklyMenuGrid from "@/components/features/weeklyMenu/WeeklyMenuGrid";
import { Wraper } from "@/components/ui/Wraper";
import { useResidentsStore } from "@/store/residents/useResidentsStore";
import ResidentSearch from "@/components/features/search/ResidentSearch";

export default function WeeklyMenuPage() {
  const weeklyMenu = useWeeklyMenuStore((state) => state.weeklyMenu);
  const residents = useResidentsStore((state) => state.residents);
  
  // Loading and error states are handled by InitialDataProvider
  const loading = false;
  const error = null;

  // Handle resident selection
  const handleResidentSelect = (resident) => {
    // Here you can add any additional logic when a resident is selected
    // For example, filtering the weekly menu by resident
    console.log("Selected resident:", resident.full_name);
    console.log("Selected id:", resident.documentId);
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
          loading={loading}
          error={error}
        />

      </Wraper>
  );
}