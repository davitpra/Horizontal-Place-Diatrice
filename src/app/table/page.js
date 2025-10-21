"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import Title from "../../components/ui/Title";
import { MealBar } from "../../components/ui/MealBar";
import { Wraper } from "@/components/ui/Wraper";
import { useCheckboxSelection } from "@/hooks/utils/useCheckboxSelection";
import { useMealsStore } from "@/store/meals/useMealsStore";
import { useSeatingConfigure } from "@/store/seating/useSeatingConfigure";
import { useMealBar } from "@/store/mealBar/useMealBar";
import { useSeatingFilters } from "@/hooks/utils/useSeatingFilters";
import ResidentTable from "@/components/features/tableResident/ResidentTable";
import { useTableFilters } from "@/hooks/utils/useTableFilters";
import { useHandleComplete } from "@/hooks/utils/useHandleComplete";
import { useTrayManagement } from "@/hooks/utils/useTrayManagement";
import { useMoreInfoModal } from "@/store/modals/useMoreInfoModal";
import { useSelectionModal } from "@/store/modals/useSelectionModal";
import { MoreInfoModal } from "@/components/features/servingModals/MoreInfoModal";
import { SelectionModal } from "@/components/features/servingModals/SelectionModal";
import { useMarkAsOut } from "@/hooks/utils/useMarkAsOut";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { ServingModal } from "@/components/features/servingModals/ServingModal";
import { TableMap } from "@/components/features/serving/TableMap";

const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  SUPPER: 'supper'
};

const MEAL_TYPE_BY_NUMBER = [
  MEAL_TYPES.BREAKFAST,
  MEAL_TYPES.LUNCH,
  MEAL_TYPES.SUPPER
];

const TABLE_COLUMNS = 6; // Checkbox + Name + To Serve + Status + Actions

export default function Tables() {
  // Get data from stores with proper Zustand selector
  const meals = useMealsStore((state) => state.meals);

  // Get UI state from stores
  const selectedSeating = useSeatingConfigure((state) => state.seating);
  const selectedMealNumber = useMealBar((state) => state.mealNumber);

  // Local state - Initialize with actual data to avoid empty first render
  const [currentMealType, setCurrentMealType] = useState(MEAL_TYPES.BREAKFAST);
  const [currentMeals, setCurrentMeals] = useState(meals[MEAL_TYPES.BREAKFAST] || []);
  const [selectedResident, setSelectedResident] = useState(null);
  const [mapView, setMapView] = useState(false);

  // Modal stores
  const InfoModal = useMoreInfoModal();
  const SelecModal = useSelectionModal();


  const handleOpenMoreInfo = useCallback((resident, index) => {
    if (!resident) return;
    setSelectedResident({ resident, index });
    InfoModal.onOpen();
  }, [InfoModal]);

  const handleSelectionModal = useCallback((resident, index) => {
    if (!resident) return;
    setSelectedResident({ resident, index });
    SelecModal.onOpen();
  }, [SelecModal]);

  // Reset resident info when modals close
  useEffect(() => {
    if (!InfoModal.isOpen && !SelecModal.isOpen) {
      setSelectedResident(null);
    }
  }, [InfoModal.isOpen, SelecModal.isOpen]);

  // Get filtered data based on seating (needs to be before useTableFilters)
  const { residentsInSeating, menusInSeating, mealsInSeating } = useSeatingFilters({
    meals: currentMeals,
    selectedSeating,
    currentMealType,
  });

  // Sort residents by table, menus and meals (needs to be before callbacks that use setMealOnTable)
  const {
    residentsOnTable,
    mealOnTable,
    updateMealOnTable,
    setMealOnTable,
  } = useTableFilters({
    residentsOnSeating: residentsInSeating,
    mealsOnSeating: mealsInSeating,
    menusOnSeating: menusInSeating,
    condition: currentMealType,
  });

  // Now we can safely create callbacks that depend on setMealOnTable
  const { handleComplete: handleCompleteAction } = useHandleComplete();

  const handleComplete = useCallback(async (meals, index) => {
    const documentId = meals[index]?.documentId;
    const mealType = MEAL_TYPE_BY_NUMBER[selectedMealNumber];

    if (!mealType) {
      console.error("Invalid meal number:", selectedMealNumber);
      return;
    }

    const newCompleteState = await handleCompleteAction({
      documentId,
      condition: currentMealType,
      mealType,
      isComplete: meals[index]?.complete
    });

    if (newCompleteState !== null) {
      setMealOnTable((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, complete: newCompleteState } : item
        )
      );
    }
  }, [selectedMealNumber, handleCompleteAction, currentMealType, setMealOnTable]);

  // Initialize checkbox selection (uses updateMealOnTable from useTableFilters)
  const {
    checked,
    selectedItems: residentsToTray,
    handleSelectAll,
    handleSelectItem,
    resetSelection,
  } = useCheckboxSelection(updateMealOnTable);

  // Memoize callbacks for better performance
  const handleTraySuccess = useCallback(() => {
    resetSelection();
  }, [resetSelection]);

  // Initialize tray management
  const { handleChangeToTray } = useTrayManagement({
    condition: currentMealType,
    mealNumber: selectedMealNumber,
    onSuccess: handleTraySuccess,
  });

  const { handleMarkAsOut } = useMarkAsOut({
    condition: currentMealType,
    mealNumber: selectedMealNumber,
    onSuccess: handleTraySuccess,
  });

  // Memoize button click handlers (after hooks initialization)
  const handleChangeToTrayClick = useCallback(() => {
    handleChangeToTray(residentsToTray);
  }, [handleChangeToTray, residentsToTray]);

  const handleMarkAsOutClick = useCallback(() => {
    handleMarkAsOut(residentsToTray);
  }, [handleMarkAsOut, residentsToTray]);


  // Update current meal type and meals when meal number or meals data changes
  // Combined into single useEffect to prevent cascading re-renders
  useEffect(() => {
    const newMealType = MEAL_TYPE_BY_NUMBER[selectedMealNumber] || MEAL_TYPES.BREAKFAST;
    const newMeals = meals[newMealType] || [];

    setCurrentMealType(newMealType);
    setCurrentMeals(newMeals);
  }, [selectedMealNumber, meals]);

  const observations = useMemo(() => [
    "A list of all residents including their name, room, seating and observation.",
  ], []);

  const router = useRouter();

  return (
    <AuthGuard>
      <div className="h-screen overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white pb-4">
          <Title
            title={"Residents"}
            observations={observations}
            button="Change to Tray"
            buttonAction={handleChangeToTrayClick}
            button2="Mark as Out"
            button2Action={handleMarkAsOutClick}
            button3={mapView ? "Table" : "Map"}
            button3Action={() => setMapView(!mapView)}
          />
          <MealBar />
        </div>
        {mapView ?
          (
            <TableMap meal={mealsInSeating} />
          ) : (
            <Wraper>
              <ResidentTable
                residents={residentsOnTable}
                mealData={updateMealOnTable}
                selectedResidents={residentsToTray}
                checked={checked}
                onSelectAll={handleSelectAll}
                onSelectItem={handleSelectItem}
                onComplete={handleComplete}
                onOpenInfo={handleOpenMoreInfo}
                onChangeSelection={handleSelectionModal}
                showTableGroups={true}
                disabled={residentsInSeating.length === 0}
                emptyMessage="No residents found for the selected seating"
                tableColumnCount={TABLE_COLUMNS}
              />
            </Wraper>
          )}
        <ServingModal
          residentsOnSeating={residentsInSeating}
          menusOnSeating={menusInSeating}
          mealsOnSeating={mealsInSeating}
          condition={currentMealType}
        />
        <MoreInfoModal
          resident={selectedResident?.resident}
          order={mealOnTable}
          index={selectedResident?.index}
          setMealOnTable={setMealOnTable}
          complete={updateMealOnTable[selectedResident?.index]?.complete}
        />
        <SelectionModal
          resident={selectedResident?.resident}
          order={mealOnTable}
          index={selectedResident?.index}
          setMealOnTable={setMealOnTable}
          mealNumber={selectedMealNumber}
        />
      </div>
    </AuthGuard>
  );
}