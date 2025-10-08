"use client";
import { useState, useEffect, useMemo, useCallback, Fragment } from "react";
import Title from "../../components/ui/Title";
import { MealBar } from "../../components/ui/MealBar";
import { Wraper } from "@/components/ui/Wraper";
import { useCheckboxSelection } from "@/hooks/utils/useCheckboxSelection";
import { useMealsStore } from "@/store/meals/useMealsStore";
import { useSeatingConfigure } from "@/store/seating/useSeatingConfigure";
import { useMealBar } from "@/store/mealBar/useMealBar";
import { useSeatingFilters } from "@/hooks/utils/useSeatingFilters";
import TableHeader from "@/components/features/tableResident/TableHeader";
import { useTableFilters } from "@/hooks/utils/useTableFilters";
import { useHandleComplete } from "@/hooks/utils/useHandleComplete";
import { useTrayManagement } from "@/hooks/utils/useTrayManagement";
import { useMoreInfoModal } from "@/store/modals/useMoreInfoModal";
import { useSelectionModal } from "@/store/modals/useSelectionModal";
import { useWeeklyMenuModal } from "@/store/modals/useWeeklyMenuModal";
import { MoreInfoModal } from "@/components/features/servingModals/MoreInfoModal";
import { SelectionModal } from "@/components/features/servingModals/SelectionModal";
import WeeklyMenuModal from "@/components/features/weeklyMenu/WeeklyMenuModal";
import CheckboxCell from "@/components/features/tableResident/CheckboxCell";
import ResidentInfo from "@/components/features/tableResident/ResidentInfo";
import ActionButtons from "@/components/features/tableResident/ActionButtons";
import { useMarkAsOut } from "@/hooks/utils/useMarkAsOut";
import AuthGuard from "@/components/auth/AuthGuard";

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

export default function Tables() {
  // Get data from stores with proper Zustand selector
  const meals = useMealsStore((state) => state.meals);

  // Get UI state from stores
  const selectedSeating = useSeatingConfigure((state) => state.seating);
  const selectedMealNumber = useMealBar((state) => state.mealNumber);

  // Local state
  const [currentMealType, setCurrentMealType] = useState(MEAL_TYPES.BREAKFAST);
  const [currentMeals, setCurrentMeals] = useState([]);
  const [residentInfo, setResidentInfo] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Modal stores
  const InfoModal = useMoreInfoModal();
  const SelecModal = useSelectionModal();
  const weeklyMenuModal = useWeeklyMenuModal();

  const handleOpenWeeklyMenuModal = useCallback(() => {
    weeklyMenuModal.onOpen();
  }, [weeklyMenuModal]);

  const handleOpenMoreInfo = useCallback((resident, index) => {
    if (!resident) return;
    setResidentInfo(resident);
    setSelectedIndex(index);
    InfoModal.onOpen();
  }, [InfoModal]);

  const handleSelectionModal = useCallback((resident, index) => {
    if (!resident) return;
    setResidentInfo(resident);
    setSelectedIndex(index);
    SelecModal.onOpen();
  }, [SelecModal]);

  // Reset resident info when modals close
  useEffect(() => {
    if (!InfoModal.isOpen && !SelecModal.isOpen) {
      setResidentInfo(null);
      setSelectedIndex(null);
    }
  }, [InfoModal.isOpen, SelecModal.isOpen]);

  // Get filtered data based on seating (needs to be before useTableFilters)
  const { residentsInSeating, menusInSeating, mealsInSeating } = useSeatingFilters({
    meals: currentMeals,
    selectedSeating,
    currentMealType,
  });

  // Ordena los residentes por mesa, menús y comidas (needs to be before callbacks that use setMealOnTable)
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
    checkbox,
    checked,
    indeterminate,
    selectedItems: residentsToTray,
    handleSelectAll,
    handleSelectItem,
    resetSelection,
  } = useCheckboxSelection(updateMealOnTable);

  // Memoize callbacks
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

  // Agrupar residentes por mesa (memoizado para evitar recalcular)
  const groupedResidents = useMemo(() => {
    return residentsOnTable.reduce((acc, resident) => {
      const tableNumber = resident.table;
      if (!acc[tableNumber]) {
        acc[tableNumber] = [];
      }
      acc[tableNumber].push(resident);
      return acc;
    }, {});
  }, [residentsOnTable]);

  // Ordenar las mesas por número (memoizado)
  const sortedTables = useMemo(() => {
    return Object.keys(groupedResidents).sort((a, b) => Number(a) - Number(b));
  }, [groupedResidents]);

  // Update current meal type when meal number changes
  useEffect(() => {
    const newMealType = MEAL_TYPE_BY_NUMBER[selectedMealNumber] || MEAL_TYPES.BREAKFAST;
    setCurrentMealType(newMealType);
  }, [selectedMealNumber]);


  // Update current meals when meal type or meals data changes
  useEffect(() => {
    if (meals && meals[currentMealType]) {
      const initialMeals = meals[currentMealType];
      setCurrentMeals(initialMeals);
      console.log(`✅ Meals loaded for ${currentMealType}: ${initialMeals.length}`);
      
      // Mark initial load as complete once we have data
      if (isInitialLoad && initialMeals.length > 0) {
        setIsInitialLoad(false);
      }
    } else {
      setCurrentMeals([]);
      console.warn(`⚠️ No meals found for type: ${currentMealType}`);
    }
  }, [currentMealType, meals, isInitialLoad]);

  const observations = [
    "A list of all residents including their name, room, seating and observation.",
  ];

  return (
    <AuthGuard>
    <div className="h-screen overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white pb-4">
        <Title
          title={"Residents"}
          observations={observations}
          button="Change to Tray"
          buttonAction={() => handleChangeToTray(residentsToTray)}
          button2="Mark as Out"
          button2Action={() => handleMarkAsOut(residentsToTray)}
          button3="Select weekly menu"
          button3Action={() => handleOpenWeeklyMenuModal()} />
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
                  disabled={residentsInSeating.length === 0}
                />
                <tbody className="divide-y divide-gray-200 bg-white">
                  {isInitialLoad ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2" />
                          <p className="text-gray-500 text-sm">Loading residents...</p>
                        </div>
                      </td>
                    </tr>
                  ) : sortedTables.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-500">
                        No residents found for the selected seating
                      </td>
                    </tr>
                  ) : (
                    sortedTables.map((tableNumber) => {
                      const residentsAtTable = groupedResidents[tableNumber];
                      return (
                        <Fragment key={tableNumber}>
                          <tr className="border-t border-gray-200">
                            <th
                              scope="colgroup"
                              colSpan={5}
                              className="bg-gray-50 py-2 pr-3 pl-4 text-center text-sm font-semibold text-gray-900 sm:pl-3"
                            >
                              Table {tableNumber}
                            </th>
                          </tr>
                          {residentsAtTable.map((resident) => {
                            const index = residentsInSeating.findIndex(r => r.documentId === resident.documentId);
                            const mealData = updateMealOnTable[index];
                            const isChecked = residentsToTray.some(
                              ({ documentId, onTray }) => 
                                documentId === mealData?.documentId && onTray === mealData?.onTray
                            );
                            
                            return (
                              <tr key={resident.documentId}>
                                <td className="relative px-6 text-center">
                                  <div className="absolute inset-y-0 left-0 hidden w-0.5 bg-indigo-600 group-has-checked:block" />
                                  <div className="flex justify-center items-center h-full">
                                    <CheckboxCell
                                      checked={isChecked}
                                      onChange={() => handleSelectItem(mealData)}
                                      disabled={residentsInSeating.length === 0}
                                      label={`Select ${resident.full_name}`}
                                    />
                                  </div>
                                </td>
                                <td className="whitespace-nowrap py-5 pl-0 pr-3 text-sm">
                                  <ResidentInfo resident={resident} mealInfo={mealData} />
                                </td>
                                <td className="hidden sm:block whitespace-nowrap px-3 py-2 text-sm text-gray-500 text-center">
                                  {Object.entries(mealData?.filterDrinks || {}).map(([key, value]) => (
                                    <div key={key} className="py-0 grid grid-cols-2 gap-0 px-0 items-center justify-center">
                                      <dt className="text-sm/6 font-medium text-gray-900 block text-center">{key}</dt>
                                      <dd className="text-sm/6 text-gray-700 mt-0 overflow-hidden text-ellipsis whitespace-nowrap text-center">
                                        {typeof value === "boolean" ? (value ? "Add" : "none") : value}
                                      </dd>
                                    </div>
                                  ))}
                                </td>
                                <ActionButtons
                                  key={resident.documentId}
                                  resident={resident}
                                  index={index}
                                  isComplete={mealData?.complete}
                                  onComplete={() => handleComplete(updateMealOnTable, index)}
                                  onOpenInfo={handleOpenMoreInfo}
                                  onChangeSelection={handleSelectionModal}
                                />
                              </tr>
                            );
                          })}
                        </Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Wraper>
      <MoreInfoModal
        resident={residentInfo}
        order={mealOnTable}
        index={selectedIndex}
        setMealOnTable={setMealOnTable}
        complete={updateMealOnTable[selectedIndex]?.complete}
      />
      <SelectionModal
        resident={residentInfo}
        order={mealOnTable}
        index={selectedIndex}
        setMealOnTable={setMealOnTable}
        mealNumber={selectedMealNumber}
      />
      <WeeklyMenuModal />
    </div>
    </AuthGuard>
  );
}