"use client";
import { useCallback, useEffect, useState} from "react";
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

function calculateCompletedByTable(meal) {
  if (!Array.isArray(meal)) {
    console.warn("meal or residentsOnSeating is not an array");
    return {};
  }

  const residentsCompleted = meal.filter((resident) => resident.complete);

  // Contar los residentes completados por mesa
  return countPeopleByTable(residentsCompleted);
}

export function TableMap({ meal }) {

  const [residentsByTable, setResidentsByTable] = useState(countPeopleByTable(meal));
  const [completedByTable, setCompletedByTable] = useState({});
  // to open or close the modal
  const tableModal = useTableModal();
  // to select a table
  const onSelect = useTableNumber((state) => state.onSelect);

  // to get the number of tables from 1 to 17
  const tablesNumbers = Array.from({ length: 17 }, (_, i) => i + 1);

  useEffect(() => {
    const peopleByTable = countPeopleByTable(meal);
    setResidentsByTable((prev) => {
      const isEqual = JSON.stringify(prev) === JSON.stringify(peopleByTable);
      return isEqual ? prev : peopleByTable;
    });
  }, [meal]);

  useEffect(() => {
    const newCompletedByTable = calculateCompletedByTable(meal);
    // Actualizar el estado solo si el valor cambia
    setCompletedByTable((prev) => {
      const isEqual = JSON.stringify(prev) === JSON.stringify(newCompletedByTable);
      return isEqual ? prev : newCompletedByTable;
    });
  }, [meal]);

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
          {residentsByTable[tableNumber] - (completedByTable[tableNumber] || 0) > 0 && (
            <>
              <div className={`chair top ${residentsByTable[tableNumber] >= 4 ? 'border border-indigo-600' : 'hidden'}`}></div>
              <div className={`chair bottom ${residentsByTable[tableNumber] >= 3 ? 'border border-indigo-600' : 'hidden'}`}></div>
              <div className={`chair left ${residentsByTable[tableNumber] >= 2 ? 'border border-indigo-600' : 'hidden'}`}></div>
              <div className={`chair right ${residentsByTable[tableNumber] >= 1 ? 'border border-indigo-600' : 'hidden'}`}></div>
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
