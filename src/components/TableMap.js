"use client"

import { useCallback, useEffect, useState} from "react";
import { useTableModal } from "../app/hooks/useTableModal";
import { useTableNumber } from "../app/hooks/useTableNumber";
import { useSeatingConfigure } from "@/app/hooks/useSeatingConfigure";
import { useMealBar } from "@/app/hooks/useMealBar";
import { useSortedResidents } from "@/app/hooks/useSortedResidents";

// function to count the people by table
function countPeopleByTable (residentsOnSeating) {
  return residentsOnSeating.reduce((acc, persona) => {
    acc[persona.table] = acc[persona.table] ? acc[persona.table] + 1 : 1;
    return acc;
  }, {});
}

export function TableMap({residents}) {
  // to open or close the modal
  const tableModal = useTableModal();
  // to select a table
  const onSelect = useTableNumber((state) => state.onSelect);
  // to get the seating number
  const onSeating = useSeatingConfigure((state) => state.seating);
  // to get the meal number of the meal bar
  const mealNumber = useMealBar((state) => state.mealNumber);

  // filter the residents by seating
  let residentsOnSeating = useSortedResidents(residents, onSeating, mealNumber);

  useEffect(() => {
    // to get the residents on the selected seating
    residentsOnSeating = useSortedResidents(residents, onSeating, mealNumber);
  }, [onSeating, mealNumber]);

  // to get the number of tables from 1 to 17
  const tablesNumbers = Array.from({ length: 17 }, (_, i) => i + 1);

  // to get the prioritary residents
  const prioritary = residentsOnSeating.filter((persona) => persona.prioritary===true);
 
  // to count the people by table and by prioritary
  const peopleByTable = countPeopleByTable(residentsOnSeating);
  const prioritaryByTable = countPeopleByTable(prioritary);

  // function to toggle the modal
  const toggleModal = useCallback(() => {
    if (tableModal.isOpen) {
      tableModal.onClose();
    } else {
      tableModal.onOpen();
    }
  }, [tableModal]);

  return (
    <div className={`flex justify-center items-center`}>
    <div className="container">
      <div className="table center">X</div>
      {tablesNumbers.map((tableNumber) => (
        <div
          key={tableNumber}
          className={`table table${tableNumber}`}
          onClick={() => {
            onSelect(tableNumber);
            toggleModal(tableNumber);
          }}
        >
          {tableNumber}
          {peopleByTable[tableNumber] - (prioritaryByTable[tableNumber] || 0) > 0 && (
            <>
              <div className={`chair top ${peopleByTable[tableNumber] >= 4 ? 'border border-indigo-600' : 'hidden'}`}></div>
              <div className={`chair bottom ${peopleByTable[tableNumber] >= 3 ? 'border border-indigo-600' : 'hidden'}`}></div>
              <div className={`chair left ${peopleByTable[tableNumber] >= 2 ? 'border border-indigo-600' : 'hidden'}`}></div>
              <div className={`chair right ${peopleByTable[tableNumber] >= 1 ? 'border border-indigo-600' : 'hidden'}`}></div>
            </>
          )}
          {(prioritaryByTable[tableNumber] || 0) > 0 && (
          
            <>
              <div className={`chair top ${prioritaryByTable[tableNumber] >= 4 ? 'border border-orange-500' : 'hidden'}`}></div>
              <div className={`chair bottom ${prioritaryByTable[tableNumber] >= 3 ? 'border border-orange-500' : 'hidden'}`}></div>
              <div className={`chair left ${prioritaryByTable[tableNumber] >= 2 ? 'border border-orange-500' : 'hidden'}`}></div>
              <div className={`chair right ${prioritaryByTable[tableNumber] >= 1 ? 'border border-orange-500' : 'hidden'}`}></div>
            </>
          )}
        </div>
      ))}
    </div>
    </div>
  );
}
