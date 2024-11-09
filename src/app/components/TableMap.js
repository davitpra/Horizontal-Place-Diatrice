"use client"

import { useCallback, useState } from "react";
import { useTableModal } from "../hooks/useTableModal";
import { useTableNumber } from "../hooks/useTableNumber";


export function TableMap({residents}) {

  const tableModal = useTableModal();
  const onSelect = useTableNumber((state) => state.onSelect);

  const tablesNumbers = Array.from({ length: 17 }, (_, i) => i + 1);

  function countPeopleByTable (residents) {
    return residents .reduce((acc, persona) => {
      acc[persona.table] = acc[persona.table] ? acc[persona.table] + 1 : 1;
      return acc;
    }, {});
  }

  const toggleModal = useCallback(() => {
    if (tableModal.isOpen) {
      tableModal.onClose();
    } else {
      tableModal.onOpen();
    }
  }, [tableModal]);

  const peopleByTable = countPeopleByTable(residents);

  if (tableModal.isOpen) return null;

  return (
    <div className="h-screen flex justify-center">
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
          <div className={`chair top ${peopleByTable[tableNumber] >= 4 ? 'bg-indigo-600' : 'hidden'}`}></div>
          <div className={`chair bottom ${peopleByTable[tableNumber] >= 3 ? 'bg-indigo-600' : 'hidden'}`}></div>
          <div className={`chair left ${peopleByTable[tableNumber] >= 2 ? 'bg-indigo-600' : 'hidden'}`}></div>
          <div className={`chair right ${peopleByTable[tableNumber] >= 1 ? 'bg-indigo-600' : 'hidden'}`}></div>
        </div>
      ))}
    </div>
    </div>
  );
}
