"use client";

import { useState, useEffect } from "react";
import { useMoreInfoModal } from "@/store/modals/useMoreInfoModal";
import { Modal } from "../../ui/Modal";
import { useMealBar } from "@/store/mealBar/useMealBar";
import { useHandleComplete } from "@/hooks/utils/useHandleComplete";
import { Table, TableHead, TableBody, EmptyRow } from "@/components/features/tableInfo/Table";

export function MoreInfoModal({
  resident,
  order = [],
  index = 0,
  complete,
}) {
  // to open or close the modal
  const InfoModal = useMoreInfoModal();
  const [open, setOpen] = useState(InfoModal.isOpen);

  // Get hooks
  const mealNumber = useMealBar((state) => state.mealNumber);
  const { handleComplete: handleCompleteAction } = useHandleComplete();
  
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
    const documentId = order[index]?.documentId;
    const mealType = ['breakfast', 'lunch', 'supper'][mealNumber] || 'breakfast';
    const condition = ['breakfast', 'lunch', 'supper'][mealNumber] || 'breakfast';

    const newCompleteState = await handleCompleteAction({
      documentId,
      condition,
      mealType,
      isComplete: localComplete
    });

    if (newCompleteState !== null) {
      setLocalComplete(newCompleteState);
    }
  };

  return (
    <Modal
      isOpen={open}
      close={InfoModal.onClose}
      title={resident?.full_name || 'Resident Information'}
      button={localComplete ? "Set as Incomplete" : "Set as Complete"}
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
      <Table>
        <TableHead columns={["To Serve", "Description"]} />
        <TableBody>
          {resident &&
          order[index] &&
          Array.isArray(order[index].meals) &&
          order[index].meals[0] ? (
            Object.entries(order[index].meals[0] || {}).map(([key, value]) => (
              <tr key={key}>
                <td className="py-3.5 pl-4 pr-3 text-center text-sm font-medium text-gray-900 sm:pl-0">
                  {key}
                </td>
                <td className="px-3 py-3.5 text-center text-sm text-gray-700">
                  {typeof value === "boolean" ? (value ? "Add" : "none") : value}
                </td>
              </tr>
            ))
          ) : (
            <EmptyRow colSpan={2} message="No meal selected" />
          )}
        </TableBody>
      </Table>
    </Modal>
  );
}
