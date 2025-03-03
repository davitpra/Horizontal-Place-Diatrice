"use client"
import { useCallback} from "react";
import { useTableModal } from "../hooks/useTableModal";
import { useTableNumber } from "../hooks/useTableNumber";
import { useResidentsOnSeating } from "@/store/useResidentsOnSeating";

// function to count the people by table
function countPeopleByTable (residentsOnSeating) {
  return residentsOnSeating.reduce((acc, persona) => {
    acc[persona.table] = acc[persona.table] ? acc[persona.table] + 1 : 1;
    return acc;
  }, {});
}

export function TableMap() {
  const residentsOnSeating = useResidentsOnSeating((state) => state.residents);
  // to open or close the modal
  const tableModal = useTableModal();
  // to select a table
  const onSelect = useTableNumber((state) => state.onSelect);

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
