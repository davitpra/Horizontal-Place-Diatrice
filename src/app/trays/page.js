"use client";
import { useState, useEffect, Fragment } from "react";
import Title from "../../components/ui/Title";
import { MealBar } from "../../components/ui/MealBar";
import { Wraper } from "@/components/ui/Wraper";
import { useCheckboxSelection } from "@/hooks/utils/useCheckboxSelection";
import { useMealsStore } from "@/store/meals/useMealsStore";
import { useMealBar } from "@/store/mealBar/useMealBar";
import TableHeader from "@/components/features/tableResident/TableHeader";
import { useTrayFilters } from "@/hooks/utils/useTrayFilters";
import { useHandleComplete } from "@/hooks/utils/useHandleComplete";
import { useTrayManagement } from "@/hooks/utils/useTrayManagement";
import { useSelectionModal } from "@/store/modals/useSelectionModal";
import { SelectionModal } from "@/components/features/servingModals/SelectionModal";
import CheckboxCell from "@/components/features/tableResident/CheckboxCell";
import ResidentInfo from "@/components/features/tableResident/ResidentInfo";
import ActionButtons from "@/components/features/tableResident/ActionButtons";
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
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <TableHeader
                    checked={checked}
                    onSelectAll={handleSelectAll}
                    disabled={residentsOnTray.length === 0}
                  />
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {residentsOnTray.map((resident) => {
                      const index = residentsOnTray.findIndex(
                        (r) => r.documentId === resident.documentId
                      );
                      return (
                        <tr key={resident.documentId}>
                          <td className="relative px-6 text-center">
                            <div className="absolute inset-y-0 left-0 hidden w-0.5 bg-indigo-600 group-has-checked:block" />
                            <div className="flex justify-center items-center h-full">
                              <CheckboxCell
                                checked={residentsToTray.some(
                                  ({ documentId, onTray }) =>
                                    documentId ===
                                      mealOnTray[index]?.documentId &&
                                    onTray === mealOnTray[index]?.onTray
                                )}
                                onChange={() =>
                                  handleSelectItem(mealOnTray[index])
                                }
                                disabled={residentsOnTray.length === 0}
                                label={`Select ${resident.full_name}`}
                              />
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-5 pl-0 pr-3 text-sm">
                            <ResidentInfo
                              resident={resident}
                              mealInfo={mealOnTray[index]}
                            />
                          </td>
                          <td className="hidden sm:block whitespace-nowrap px-3 py-2 text-sm text-gray-500 text-center">
                            {Object.entries(
                              mealOnTray[index]?.meals[0] || {}
                            ).map(([key, value]) => (
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
                            ))}
                          </td>
                          <ActionButtons
                            key={resident.documentId}
                            resident={resident}
                            index={index}
                            isComplete={mealOnTray[index]?.complete}
                            onComplete={() => handleComplete(mealOnTray, index)}
                            onChangeSelection={handleSelectionModal}
                          />
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
