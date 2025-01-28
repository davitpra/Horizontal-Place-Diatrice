"use client";

import { useState, useEffect } from "react";
import { useMoreInfoModal } from "@/hooks/useMoreInfoModal";
import { Modal } from "./Modal";
import { useMealBar } from "@/hooks/useMealBar";

export function MoreInfoModal({ resident }) {
  // to open or close the modal
  const InfoModal = useMoreInfoModal();
  const [open, setOpen] = useState(InfoModal.isOpen);

  const mealNumber = useMealBar((state) => state.mealNumber);

  // Close modal when the InfoModal state changes
  useEffect(() => {
    setOpen(InfoModal.isOpen);
  }, [InfoModal.isOpen]);

  // Close modal when pick out of the modal
  useEffect(() => {
    if (!open) {
      InfoModal.onClose();
    }
  }, [open]);

  return (
    <Modal
      isOpen={open}
      close={InfoModal.onClose}
      title={resident.full_name}
      button="Change Selection"
    >
      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
        Complete
      </span>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    To Serve
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {resident && resident.meals && resident.meals[mealNumber] ? (
                  Object.entries(resident.meals[mealNumber]).map(
                    ([key, value]) => (
                      <tr key={key}>
                        <td className="py-3.5 pl-4 pr-3 text-left text-sm text-gray-900 sm:pl-0">
                          {key}
                        </td>
                        <td className="px-3 py-3.5 pr-3 text-left text-sm text-gray-900 sm:pl-0">
                          {value}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td className="py-3.5 pl-4 pr-3 text-left text-sm text-gray-900 sm:pl-0">
                      No meal selected
                    </td>
                    <td className="px-3 py-3.5 pr-3 text-left text-sm text-gray-900 sm:pl-0">
                      Please select a meal
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
}
