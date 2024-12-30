"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useTableModal } from "../app/hooks/useTableModal";
import { useTableNumber } from "../app/hooks/useTableNumber";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function Modal({ residents, children }) {
  const tableModal = useTableModal();
  const selectTable = useTableNumber((state) => state.tableNumber);
  const [open, setOpen] = useState(tableModal.isOpen);

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
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
              <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                <div className="ml-4 mt-2">
                  <h3 className="text-base font-semibold text-gray-900">
                    Table {selectTable}
                  </h3>
                </div>
                <div className="ml-4 mt-2 shrink-0">
                  <button
                    type="button"
                    className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Take Order
                  </button>
                </div>
              </div>
            </div>
              {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
