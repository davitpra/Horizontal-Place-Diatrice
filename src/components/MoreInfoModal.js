"use client";

import { useState, useEffect } from "react";
import { useMoreInfoModal } from "@/hooks/useMoreInfoModal";
import { Modal } from "./Modal";
import { changeBreakfast } from "@/lib/changeBreakfast";

export function MoreInfoModal({
  resident,
  preferences = [],
  index = 0,
  mealNumber = 0,
  setPreferences,
}) {
  // to open or close the modal
  const InfoModal = useMoreInfoModal();
  const [open, setOpen] = useState(InfoModal.isOpen);

  const pref = preferences[index];
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
      const documentId = preferences[index]?.documentId;
      if (!documentId) {
        console.error("No documentId found for the selected preference.");
        return;
      }
      // Actualizar el estado en el backend si es necesario
      if (mealNumber === 0) {
        await changeBreakfast({
          documentId,
          complete: !pref?.complete, // Enviar el nuevo estado de `complete`
        });
      }
      // Actualizar el estado local de las preferencias
      setPreferences((prevPreferences) =>
        prevPreferences.map((preference, i) =>
          i === index
            ? {
                ...preference,
                complete: !pref?.complete, // Cambiar el estado local
              }
            : preference
        )
      );

      InfoModal.onClose();
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
          pref?.complete
            ? "bg-green-50 text-green-700 ring-green-600/20"
            : "bg-gray-50 text-gray-700 ring-gray-600/20"
        }`}
      >
        {pref?.complete ? "Complete" : "Not Complete"}
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
                preferences[index] &&
                Array.isArray(preferences[index].meals) &&
                preferences[index].meals[0] ? (
                  Object.entries(preferences[index].meals[0] || {}).map(
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
