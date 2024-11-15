"use client"

import { useCallback, useEffect, useState} from "react";
import { useTableModal } from "../hooks/useTableModal";
import { useTableNumber } from "../hooks/useTableNumber";


export function TableMap({residents}) {
  const tableModal = useTableModal();
  const onSelect = useTableNumber((state) => state.onSelect);

  const tablesNumbers = Array.from({ length: 17 }, (_, i) => i + 1);

  const prioritary = residents.filter((persona) => persona.prioritary===true);

  function countPeopleByTable (residents) {
    return residents .reduce((acc, persona) => {
      acc[persona.table] = acc[persona.table] ? acc[persona.table] + 1 : 1;
      return acc;
    }, {});
  }
  const peopleByTable = countPeopleByTable(residents);
  const prioritaryByTable = countPeopleByTable(prioritary);

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
