"use client";
import { useWeeklyMenuStore } from "@/store/meals/useWeeklyMenuStore";
import WeeklyMenuGrid from "@/components/features/weeklyMenu/WeeklyMenuGrid";
import { Wraper } from "@/components/ui/Wraper";
import Title from "@/components/ui/Title";

export default function WeeklyMenuPage() {
  const weeklyMenu = useWeeklyMenuStore((state) => state.weeklyMenu);
  
  // Loading and error states are handled by InitialDataProvider
  const loading = false;
  const error = null;

  return (
    <>
      <Title
        title={"September 2025"}
        observations={["Un calendario con las fechas de los menus de la semana", "los desayunos son opcionales a elegir"]}
      />

      <WeeklyMenuGrid
        menuData={weeklyMenu}
        loading={loading}
        error={error}
      />
      <Wraper>

      </Wraper>
    </>
  );
}