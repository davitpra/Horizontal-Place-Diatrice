"use client"
import { useCallback, useEffect, useState, useMemo} from "react";
import { useTableModal } from "../hooks/useTableModal";
import { useTableNumber } from "../hooks/useTableNumber";

// function to count the people by table
function countPeopleByTable(residentsOnSeating) {
  if (!Array.isArray(residentsOnSeating)) {
    return {}; 
  }

  return residentsOnSeating.reduce((acc, persona) => {
    acc[persona.table] = acc[persona.table] ? acc[persona.table] + 1 : 1;
    return acc;
  }, {});
}

export function TableMap({ residentsOnSeating , meal}) {
  const [completedByTable, setCompletedByTable] = useState({});
  // to open or close the modal
  const tableModal = useTableModal();
  // to select a table
  const onSelect = useTableNumber((state) => state.onSelect);

  // to get the number of tables from 1 to 17
  const tablesNumbers = Array.from({ length: 17 }, (_, i) => i + 1);
  
  // to count the people by table and by prioritary
  const peopleByTable = countPeopleByTable(residentsOnSeating);

  useEffect(() => {
    if (!Array.isArray(meal) || !Array.isArray(residentsOnSeating)) {
      console.warn("meal or residentsOnSeating is not an array");
      setCompletedByTable({});
      return;
    }
  
    const residentsCompleted = residentsOnSeating.reduce((acc, resident, index) => {
      const correspondingBreakfast = meal[index];
      if (correspondingBreakfast?.complete) {
        acc.push(resident);
      }
      return acc;
    }, []);

    console.log("residentsCompleted", residentsCompleted);
  
    const newCompletedByTable = countPeopleByTable(residentsCompleted);
  
    setCompletedByTable(newCompletedByTable);
  }, [residentsOnSeating, meal]);

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
          {peopleByTable[tableNumber] - (completedByTable[tableNumber] || 0) > 0 && (
            <>
              <div className={`chair top ${peopleByTable[tableNumber] >= 4 ? 'border border-indigo-600' : 'hidden'}`}></div>
              <div className={`chair bottom ${peopleByTable[tableNumber] >= 3 ? 'border border-indigo-600' : 'hidden'}`}></div>
              <div className={`chair left ${peopleByTable[tableNumber] >= 2 ? 'border border-indigo-600' : 'hidden'}`}></div>
              <div className={`chair right ${peopleByTable[tableNumber] >= 1 ? 'border border-indigo-600' : 'hidden'}`}></div>
            </>
          )}
          {(completedByTable[tableNumber] || 0) > 0 && (
          
            <>
              <div className={`chair top ${completedByTable[tableNumber] >= 4 ? 'bg-indigo-400' : 'hidden'}`}></div>
              <div className={`chair bottom ${completedByTable[tableNumber] >= 3 ? 'bg-indigo-400' : 'hidden'}`}></div>
              <div className={`chair left ${completedByTable[tableNumber] >= 2 ? 'bg-indigo-400' : 'hidden'}`}></div>
              <div className={`chair right ${completedByTable[tableNumber] >= 1 ? 'bg-indigo-400' : 'hidden'}`}></div>
            </>
          )}
        </div>
      ))}
    </div>
    </div>
  );
}
