"use client";
import React from "react";
import { useTableModal } from "../hooks/useTableModal";
import { useTableNumber } from "../hooks/useTableNumber";
import { useRouter } from "next/navigation";

export function TableModal({ residents }) {
  const route = useRouter();

  const tableModal = useTableModal();
  const selectTable = useTableNumber();

  const ResidentsOnTable = residents.filter(
    (resident) => resident.table === selectTable.tableNumber
  );

  if (!tableModal.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="w-10/12 flex flex-col">
        <button
          onClick={tableModal.onClose}
          className="text-white text-xl place-self-end"
        >
          X
        </button>
        <div className="bg-white p-4 rounded min-h-40">
          <h2 className="text-center text-xl font-bold pt-4 pb-4">
            Table {selectTable.tableNumber}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {ResidentsOnTable.map((resident) => (
              <button
                key={resident.id}
                className="bg-gray-100 p-2 rounded text-sm"
                onClick={() => {
                  route.push(`./room/${resident.roomId}`);
                  tableModal.onClose();
                }}
              >
                <h3 className=" pl-2">
                  {resident.name} {resident.lastName}
                </h3>
                <p className="text-xs pl-4">Room: {resident.roomId}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
