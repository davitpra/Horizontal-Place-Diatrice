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
  const [updateMealOnTable, setUpdateMealOnTable] = useState([]);

  // Update meal table state when meals or seating changes
  useEffect(() => {
    if (!currentMeals) return;
    
    const initialMealState = currentMeals.map(meal => ({
      complete: false,
      filterDrinks: meal.preferences || {},
      documentId: meal.documentId, // Add this to maintain consistency with selection
    }));

    // Only update if the state actually changed
    const hasStateChanged = JSON.stringify(initialMealState) !== JSON.stringify(updateMealOnTable);
    if (hasStateChanged) {
      setUpdateMealOnTable(initialMealState);
    }
  }, [currentMeals]);

  const handleOpenMoreInfo = (resident) => {
    // TODO: Implement modal or drawer to show more resident information
    console.log('Opening more info for:', resident);
  };

  const handleComplete = (meals, index) => {
    const updatedMeals = [...updateMealOnTable];
    updatedMeals[index] = {
      ...updatedMeals[index],
      complete: !updatedMeals[index]?.complete
    };
    setUpdateMealOnTable(updatedMeals);
  };

  const handleSelectionModal = (resident) => {
    // TODO: Implement selection modal logic
    console.log('Opening selection modal for:', resident);
  };

  const {
    checkbox,
    checked,
    indeterminate,
    selectedItems: residentsToTray,
    handleSelectAll,
    handleSelectItem,
    resetSelection,
  } = useCheckboxSelection(updateMealOnTable);

  // Get filtered data based on seating
  const { residentsInSeating, menusInSeating, mealsInSeating } = useSeatingFilters({
    meals: currentMeals,
    selectedSeating,
    currentMealType,
  });

  // Agrupar residentes por mesa
  const groupedResidents = residentsInSeating.reduce((acc, resident) => {
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
                          className="bg-gray-50 py-2 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3"
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
    </>
  );
}