"use client";
import { useState, useEffect, Fragment } from "react";
import Title from "../../components/ui/Title";
import { MealBar } from "../../components/ui/MealBar";
import { Wraper } from "@/components/ui/Wraper";
import { useCheckboxSelection } from "@/hooks/utils/useCheckboxSelection";
import { useMealsStore } from "@/store/meals/useMealsStore";
import { useSeatingConfigure } from "@/store/seating/useSeatingConfigure";
import { useMealBar } from "@/store/mealBar/useMealBar";
import { useSeatingFilters } from "@/hooks/utils/useSeatingFilters";
import TableHeader from "@/components/features/table/TableHeader";
import ResidentTableRow from "@/components/features/table/ResidentTableRow";
import { useTableFilters } from "@/hooks/utils/useTableFilters";
import { useHandleComplete } from "@/hooks/utils/useHandleComplete";
import { useMoreInfoModal } from "@/store/modals/useMoreInfoModal";
import { useSelectionModal } from "@/store/modals/useSelectionModal";
import { MoreInfoModal } from "@/components/features/servingModals/MoreInfoModal";
import { SelectionModal } from "@/components/features/servingModals/SelectionModal";

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
  // Get data from stores
  const { meals } = useMealsStore();

  // Get UI state from stores
  const selectedSeating = useSeatingConfigure((state) => state.seating);
  const selectedMealNumber = useMealBar((state) => state.mealNumber);

  // Local state
  const [currentMealType, setCurrentMealType] = useState(MEAL_TYPES.BREAKFAST);
  const [currentMeals, setCurrentMeals] = useState(meals[MEAL_TYPES.BREAKFAST]);
  const [residentInfo, setResidentInfo] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Modal stores
  const InfoModal = useMoreInfoModal();
  const SelecModal = useSelectionModal();

  const handleOpenMoreInfo = (resident, index) => {
    if (!resident) return;
    setResidentInfo(resident);
    setSelectedIndex(index);
    InfoModal.onOpen();
  };

  const handleSelectionModal = (resident, index) => {
    if (!resident) return;
    setResidentInfo(resident);
    setSelectedIndex(index);
    SelecModal.onOpen();
  };

  // Reset resident info when modals close
  useEffect(() => {
    if (!InfoModal.isOpen && !SelecModal.isOpen) {
      setResidentInfo(null);
      setSelectedIndex(null);
    }
  }, [InfoModal.isOpen, SelecModal.isOpen]);

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
      isComplete: meals[index]?.complete
    });

    if (newCompleteState !== null) {
      setMealOnTable((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, complete: newCompleteState } : item
        )
      );
    }
  };

  // Get filtered data based on seating
  const { residentsInSeating, menusInSeating, mealsInSeating } = useSeatingFilters({
    meals: currentMeals,
    selectedSeating,
    currentMealType,
  });


  // Ordena los residentes por mesa, menús y comidas
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

  // Agrupar residentes por mesa
  const groupedResidents = residentsOnTable.reduce((acc, resident) => {
    const tableNumber = resident.table;
    if (!acc[tableNumber]) {
      acc[tableNumber] = [];
    }
    acc[tableNumber].push(resident);
    return acc;
  }, {});

  // Ordenar las mesas por número
  const sortedTables = Object.keys(groupedResidents).sort((a, b) => Number(a) - Number(b));

  // Update current meal type when meal number changes
  useEffect(() => {
    const newMealType = MEAL_TYPE_BY_NUMBER[selectedMealNumber] || MEAL_TYPES.BREAKFAST;
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
  } = useCheckboxSelection(updateMealOnTable);
  
  const observations = [
    "Overview of the meals being served, meal preferences and dietary needs.",
  ];

  return (
    <>
      <Title title={"Summary"} observations={observations} />
      <MealBar />
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
                  {sortedTables.map((tableNumber) => (
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
                      {groupedResidents[tableNumber].map((resident) => {
                        const index = residentsInSeating.findIndex(r => r.documentId === resident.documentId);
                        return (
                          <ResidentTableRow
                            key={resident.documentId}
                            resident={resident}
                            index={index}
                            isSelected={residentsToTray.some(item => item.documentId === resident.documentId)}
                            onSelect={handleSelectItem}
                            disabled={residentsInSeating.length === 0}
                            mealInfo={updateMealOnTable[index]}
                            isComplete={updateMealOnTable[index]?.complete}
                            onComplete={() => handleComplete(updateMealOnTable, index)}
                            onOpenInfo={handleOpenMoreInfo}
                            onChangeSelection={handleSelectionModal}
                          />
                        );
                      })}
                    </Fragment>
                  ))}
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
        order={updateMealOnTable}
        index={selectedIndex}
        setMealOnTable={setMealOnTable}
        mealNumber={selectedMealNumber}
      />
    </>
  );
}