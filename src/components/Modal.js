"use client";

import { useState, useEffect } from "react";
import { useTableModal } from "../app/hooks/useTableModal";
import { useTableNumber } from "../app/hooks/useTableNumber";
import { Dialog, DialogPanel } from "@headlessui/react";
import { TableModal } from "./TableModal";
import { useSeatingConfigure } from "@/app/hooks/useSeatingConfigure";
import { useMealBar } from "@/app/hooks/useMealBar";
import { useSortedResidents } from "@/app/hooks/useSortedResidents";

export function Modal({ residents }) {
  // to open or close the modal
  const tableModal = useTableModal();
  // to select a table number
  const selectTable = useTableNumber((state) => state.tableNumber);

  const [open, setOpen] = useState(tableModal.isOpen);

  // to get the seating number
  const onSeating = useSeatingConfigure((state) => state.seating);
  // to get the meal number of the meal bar
  const mealNumber = useMealBar((state) => state.mealNumber);

  // filter the residents by seating
  let sortedResidents = useSortedResidents(residents, onSeating, mealNumber);

  useEffect(() => {
    // to get the residents on the selected seating
    sortedResidents = useSortedResidents(residents, onSeating, mealNumber);
  }, [onSeating, mealNumber]);

  // console.log("SortedResidents", sortedResidents);
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
                  Add a Guess
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
