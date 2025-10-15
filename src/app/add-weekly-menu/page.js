"use client";
import { useWeeklyMenuStore } from "@/store/meals/useWeeklyMenuStore";
import { WeeklyMenuGrid } from "@/components/features/weeklyMenu/WeeklyMenuGrid";
import { Wraper } from "@/components/ui/Wraper";
import { useResidentsStore } from "@/store/residents/useResidentsStore";
import ResidentSearch from "@/components/features/search/ResidentSearch";
import { getResidentWeeklyMenus } from "@/strapi/menus/getResidentWeeklyMenus";
import { useState, useEffect } from "react";
import { saveResidentWeekSelections } from "@/strapi/menus/saveResidentWeekSelections";
import { date } from "@/constants/date";
import { getMonthYearFromISO } from "@/utils/date";
import Title from "@/components/ui/Title";

export default function WeeklyMenuPage() {
  const weeklyMenu = useWeeklyMenuStore((state) => state.weeklyMenu);
  const residents = useResidentsStore((state) => state.residents);

  const [weeklyMenuSelected, setWeeklyMenuSelected] = useState(null);
  const [selectedResident, setSelectedResident] = useState(null);
  const [pendingSelections, setPendingSelections] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const { month, year } = getMonthYearFromISO(date);

  // Loading and error states are handled by InitialDataProvider
  const loading = false;
  const error = null;


  // Handle resident selection
  const handleResidentSelect = async (resident) => {
    // Early return if no resident is selected (cleared search)
    if (!resident) {
      setWeeklyMenuSelected(null);
      setSelectedResident(null);
      setPendingSelections({});
      return;
    }

    if (resident.moved_out) {
      setSaveError("This resident has moved out.");
      return;
    }

    try {
      setSelectedResident(resident);
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

  // Toggle selection for a given date/meal/field enforcing exclusivity where needed
  const handleSelectionChange = (dateStr, mealType, field, nextValue) => {
    setSaveError("");
    setSaveSuccess("");

    const mealKey = mealType.toLowerCase(); // breakfast | lunch | supper

    setPendingSelections((prev) => {
      const prevDate = prev[dateStr] || {};
      const prevMeal = prevDate[mealKey] || {};
      const updatedMeal = { ...prevMeal, [field]: nextValue };

      // Exclusivity: only one of option_1 / option_2 for lunch and supper
      if ((mealKey === "lunch" || mealKey === "supper") && (field === "option_1" || field === "option_2") && nextValue) {
        const opposite = field === "option_1" ? "option_2" : "option_1";
        updatedMeal[opposite] = false;
      }

      // Preserve false to allow deselection overrides to persist until save
      const nextDate = { ...prevDate, [mealKey]: updatedMeal };
      return { ...prev, [dateStr]: nextDate };
    });
  };

  const hasPendingChanges = Object.keys(pendingSelections).length > 0;

  const handleSaveWeek = async () => {
    if (!selectedResident || !hasPendingChanges) return;
    setIsSaving(true);
    setSaveError("");
    setSaveSuccess("");
    try {
      await saveResidentWeekSelections({
        selectedResident: selectedResident,
        selections: pendingSelections,
        schedule: weeklyMenu,
      });

      // Refresh resident selections and clear pending
      const refreshed = await getResidentWeeklyMenus(selectedResident.documentId);
      setWeeklyMenuSelected(refreshed);
      setPendingSelections({});
      setSaveSuccess("Selecciones guardadas para la semana.");
    } catch (e) {
      console.error(e);
      setSaveError("No se pudieron guardar las selecciones. Inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  const observations = [
    "A calendar showing the weekly menu dates.",
    "If no breakfast selection has been made, it will be served according to the resident’s preferences.",
  ];

  return (
    <>
      <Title
        title={`${month} ${year}`}
        observations={observations}
        className="mb-8"
        button={isSaving ? "Saving..." : "Save Week"}
        buttonAction={() => {
          console.log("Save Week");
          handleSaveWeek();
        }}
        button2="Edit Menu"
        button2Action={() => {

          console.log("Edit Menu");
        }}
        button2Disabled={!selectedResident || !hasPendingChanges || isSaving}
      />
      {/* Save Week Actions */}
      <div className="mt-6 flex items-center gap-4">
        {saveSuccess && (
          <span className="text-sm text-green-700" role="status">{saveSuccess}</span>
        )}
        {saveError && (
          <span className="text-sm text-red-600" role="alert">{saveError}</span>
        )}
      </div>
      <Wraper>
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
          pendingSelections={pendingSelections}
          onSelectionChange={handleSelectionChange}
          disabled={!selectedResident}
          loading={loading}
          error={error}
        />
      </Wraper>
    </>
  );
}