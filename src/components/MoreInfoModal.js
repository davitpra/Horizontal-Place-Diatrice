"use client";

import { useState, useEffect } from "react";
import { useMoreInfoModal } from "@/hooks/useMoreInfoModal";
import { Modal } from "./Modal";
import { changeComplete } from "@/lib/changeComplete";
import { useDayBreakfastStore } from "@/store/useDayBreakfastStore";

export function MoreInfoModal({
  resident,
  order = [],
  index = 0,
  complete,
}) {
  // to open or close the modal
  const InfoModal = useMoreInfoModal();
  const [open, setOpen] = useState(InfoModal.isOpen);

  //store the complete state
  const setDayBreakfast = useDayBreakfastStore(
    (state) => state.setDayBreakfast
  );

  const [localComplete, setLocalComplete] = useState(complete);

  // Sincronizar el estado local con el valor de la prop `complete` cuando cambie
  useEffect(() => {
    setLocalComplete(complete);
  }, [complete]);

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

  const handleComplete = async () => {
    try {
      const documentId = order[index]?.documentId;
      if (!documentId) {
        console.error("No documentId found for the selected preference.");
        return;
      }

      // Actualizar el backend
      await changeComplete({
        documentId,
        complete: !localComplete,
      });

      // Actualizar el estado en el store
      setDayBreakfast((prevState) =>
        prevState.map((preference) =>
          preference.documentId === documentId
            ? {
                ...preference,
                complete: !localComplete,
              }
            : preference
        )
      );

      // Actualizar el estado local
      setLocalComplete(!localComplete);
      console.log("Meal selection saved successfully.");
    } catch (error) {
      console.error("Error saving meal selection:", error);
    }
  };

  return (
    <Modal
      isOpen={open}
      close={InfoModal.onClose}
      title={resident.full_name}
      button="Complete"
      buttonAction={handleComplete}
    >
      <span
        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
          localComplete
            ? "bg-green-50 text-green-700 ring-green-600/20"
            : "bg-gray-50 text-gray-700 ring-gray-600/20"
        }`}
      >
        {localComplete ? "Complete" : "Not Complete"}
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
                {resident &&
                order[index] &&
                Array.isArray(order[index].meals) &&
                order[index].meals[0] ? (
                  Object.entries(order[index].meals[0] || {}).map(
                    ([key, value]) => (
                      <tr key={key}>
                        <td className="py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-0">
                          {key}
                        </td>
                        <td className="px-3 py-3.5 text-left text-sm text-gray-700">
                          {typeof value === "boolean"
                            ? value
                              ? "Add"
                              : "none"
                            : value}
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
