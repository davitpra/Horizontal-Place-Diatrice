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
import { WeeklyMenuSelected } from "@/components/features/weeklyMenu/WeeklyMenuSelected";
import { Loading } from "@/components/ui/Loading";
import toast from "react-hot-toast";

export default function WeeklyMenuPage() {
  const weeklyMenu = useWeeklyMenuStore((state) => state.weeklyMenu);
  const residents = useResidentsStore((state) => state.residents);

  const [weeklyMenuSelected, setWeeklyMenuSelected] = useState(null);
  const [selectedResident, setSelectedResident] = useState(null);
  const [pendingSelections, setPendingSelections] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
      toast.error("This resident has moved out.");
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
      toast.success("Selections saved for the week.");
    } catch (e) {
      console.error(e);
      toast.error("Could not save selections. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const observations = [
    "A calendar showing the weekly menu dates.",
    "If no breakfast selection has been made, it will be served according to the resident’s preferences.",
  ];

  console.log("isEditing", isEditing);

  if (isSaving) {
    return <Loading message="Saving selections..." size="md" />;
  }

  return (
    <>
      <Title
        title={`${month} ${year}`}
        observations={observations}
        className="mb-8"
        button={isSaving ? "Saving..." : "Save Week"}
        button1ClassName={!isEditing ? "hidden" : "block"}
        button1Disabled={!selectedResident || !hasPendingChanges || isSaving}
        buttonAction={() => {
          console.log("Save Week");
          handleSaveWeek();
        }}
        button2={isEditing ? "Cancel" : "Edit Menu"}
        button2ClassName={!selectedResident ? "hidden" : "block"}
        button2Action={() => {
          console.log("Edit Menu");
          setIsEditing(!isEditing);
        }}
      />
      <Wraper>
        {/* Search Section */}
        <ResidentSearch
          residents={residents}
          onSelectResident={handleResidentSelect}
          label="Search menu by resident"
          placeholder="Search by resident name..."
        />
        {isEditing && (
        <WeeklyMenuGrid
          menuData={weeklyMenu}
          menuDataSelected={weeklyMenuSelected}
          pendingSelections={pendingSelections}
          onSelectionChange={handleSelectionChange}
          disabled={!selectedResident}
          loading={loading}
        error={error}
        />
        ) }
        {!isEditing && (
        <WeeklyMenuSelected
          menuData={weeklyMenu}
          menuDataSelected={weeklyMenuSelected}
          loading={loading}
          error={error}
        />
        )}
      </Wraper>
    </>
  );
}