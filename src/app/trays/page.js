"use client";
import { useState, useEffect } from "react";
import Title from "../../components/ui/Title";
import { MealBar } from "../../components/ui/MealBar";
import { Wraper } from "@/components/ui/Wraper";
import { useCheckboxSelection } from "@/hooks/utils/useCheckboxSelection";
import { useMealsStore } from "@/store/meals/useMealsStore";
import { useMealBar } from "@/store/mealBar/useMealBar";
import ResidentTable from "@/components/features/tableResident/ResidentTable";
import { useTrayFilters } from "@/hooks/utils/useTrayFilters";
import { useHandleComplete } from "@/hooks/utils/useHandleComplete";
import { useTrayManagement } from "@/hooks/utils/useTrayManagement";
import { useSelectionModal } from "@/store/modals/useSelectionModal";
import { SelectionModal } from "@/components/features/servingModals/SelectionModal";
import { useMarkAsOut } from "@/hooks/utils/useMarkAsOut";
import AuthGuard from "@/components/auth/AuthGuard";

const MEAL_TYPES = {
  BREAKFAST: "breakfast",
  LUNCH: "lunch",
  SUPPER: "supper",
};

const MEAL_TYPE_BY_NUMBER = [
  MEAL_TYPES.BREAKFAST,
  MEAL_TYPES.LUNCH,
  MEAL_TYPES.SUPPER,
];

export default function Tables() {
  // Get data from stores
  const { meals } = useMealsStore();

  // Get UI state from stores
  const selectedMealNumber = useMealBar((state) => state.mealNumber);

  // Local state
  const [currentMealType, setCurrentMealType] = useState(MEAL_TYPES.BREAKFAST);
  const [currentMeals, setCurrentMeals] = useState(meals[MEAL_TYPES.BREAKFAST]);
  const [residentInfo, setResidentInfo] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Modal stores
  const SelecModal = useSelectionModal();

  const handleOpenMoreInfo = (resident, index) => {
    if (!resident) return;
    setResidentInfo(resident);
    setSelectedIndex(index);
    SelecModal.onOpen();
  };

  const handleSelectionModal = (resident, index) => {
    if (!resident) return;
    setResidentInfo(resident);
    setSelectedIndex(index);
    SelecModal.onOpen();
  };

  // Reset resident info when modals close
  useEffect(() => {
    if (!SelecModal.isOpen) {
      setResidentInfo(null);
      setSelectedIndex(null);
    }
  }, [SelecModal.isOpen]);

  const { handleComplete: handleCompleteAction } = useHandleComplete();

  const handleComplete = async (meals, index) => {
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
      isComplete: meals[index]?.complete,
    });

    if (newCompleteState !== null) {
      setMealOnTray((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, complete: newCompleteState } : item
        )
      );
    }
  };

  // Initialize tray management
  const { handleChangeToTray } = useTrayManagement({
    condition: currentMealType,
    mealNumber: selectedMealNumber,
    onSuccess: () => {
      resetSelection();
    },
  });

  const { handleMarkAsOut } = useMarkAsOut({
    condition: currentMealType,
    mealNumber: selectedMealNumber,
    onSuccess: () => {
      resetSelection();
    },
  });

  // Ordena los residentes por mesa, menús y comidas
  const { residentsOnTray, mealOnTray, setMealOnTray } = useTrayFilters({
    meal: currentMeals,
    condition: currentMealType,
  });

  // Update current meal type when meal number changes
  useEffect(() => {
    const newMealType =
      MEAL_TYPE_BY_NUMBER[selectedMealNumber] || MEAL_TYPES.BREAKFAST;
    setCurrentMealType(newMealType);
  }, [selectedMealNumber]);

  // Update current meals when meal type or meals data changes
  useEffect(() => {
    if (meals[currentMealType]) {
      const initialMeals = meals[currentMealType];
      setCurrentMeals(initialMeals);
    }
  }, [currentMealType, meals]);

  // Initialize checkbox selection
  const {
    checkbox,
    checked,
    indeterminate,
    selectedItems: residentsToTray,
    handleSelectAll,
    handleSelectItem,
    resetSelection,
  } = useCheckboxSelection(mealOnTray);

  const observations = [
    "For breakfast tray call to 3009 (Housekeeping) to take the trays",
    "To call the West Wing call to 3002",
    "To call the East Wing call to 3004",
  ];

  return (
    <AuthGuard>
      <div className="h-screen overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white pb-4">
          <Title
            title={"Residents"}
            observations={observations}
            button="Take out of Tray"
            buttonAction={() => handleChangeToTray(residentsToTray)}
            button2="Mark as Out"
            button2Action={() => handleMarkAsOut(residentsToTray)}
          />
          <MealBar />
        </div>
        <Wraper>
          <ResidentTable
            residents={residentsOnTray}
            mealData={mealOnTray}
            selectedResidents={residentsToTray}
            checked={checked}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectItem}
            onComplete={handleComplete}
            onOpenInfo={handleOpenMoreInfo}
            onChangeSelection={handleSelectionModal}
            showTableGroups={false}
            disabled={residentsOnTray.length === 0}
            emptyMessage="No residents found on tray"
            customRenderDrinksColumn={(mealItem) => 
              Object.entries(mealItem?.meals?.[0] || {}).map(([key, value]) => (
                <div
                  key={key}
                  className="py-0 grid grid-cols-2 gap-0 px-0 items-center justify-center"
                >
                  <dt className="text-sm/6 font-medium text-gray-900 block text-center">
                    {key}
                  </dt>
                  <dd className="text-sm/6 text-gray-700 mt-0 overflow-hidden text-ellipsis whitespace-nowrap text-center">
                    {typeof value === "boolean"
                      ? value
                        ? "Add"
                        : "none"
                      : value}
                  </dd>
                </div>
              ))
            }
          />
        </Wraper>
        <SelectionModal
          resident={residentInfo}
          order={mealOnTray}
          index={selectedIndex}
          setMealOnTable={setMealOnTray}
          mealNumber={selectedMealNumber}
        />
      </div>
    </AuthGuard>
  );
}
