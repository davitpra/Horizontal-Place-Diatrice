"use client";

import { useState, useEffect } from "react";
import { useTableModal } from "../app/hooks/useTableModal";
import { useTableNumber } from "../app/hooks/useTableNumber";
import { Dialog, DialogPanel } from "@headlessui/react";
import {TableModal} from "./TableModal";
import { useSeatingConfigure } from "@/app/hooks/useSeatingConfigure";

export function Modal({ residents }) {
  const tableModal = useTableModal();
  const selectTable = useTableNumber((state) => state.tableNumber);

  const [open, setOpen] = useState(tableModal.isOpen);

  let seating =useSeatingConfigure((state) => state.seating);
  console.log("Seating", seating);
  const sortedResidents = residents.filter((resident) => resident.Seating === seating);
  console.log("SortedResidents", sortedResidents);
  const residentsOnTable = sortedResidents.filter(
    (resident) => resident.table === selectTable
  );

  // Close modal when the TableModal state changes
  useEffect(() => {
    setOpen(tableModal.isOpen);
  }, [tableModal.isOpen]);

  // Close modal when pick out of the modal
  useEffect(() => {
    if (!open) {
      tableModal.onClose();
    }
  }, [open]);

  const ResidentsOnTable = residents.filter(
    (resident) => resident.table === selectTable.tableNumber
  );

  return (
    <Dialog open={open} onClose={tableModal.onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
        <div className="w-10/12 flex flex-col">
          <DialogPanel className="bg-white p-6 rounded">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Table {selectTable}
              </h3>
              <div className="ml-4 mt-2 shrink-0">
                <button
                  type="button"
                  className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Take Order
                </button>
              </div>
            </div>
            <TableModal residents={residentsOnTable} />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
