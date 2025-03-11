"use client";

import { useState, useEffect } from "react";
import { useTableModal } from "../hooks/useTableModal";
import { useTableNumber } from "../hooks/useTableNumber";
import { TableModal } from "./TableModal";
import { Modal } from "./Modal";

export function ServingModal({residentsOnSeating}) {

  // to open or close the modal
  const tableModal = useTableModal();
  // to select a table number
  const selectTable = useTableNumber((state) => state.tableNumber);

  const [open, setOpen] = useState(tableModal.isOpen);
;
  const residentsOnTable = residentsOnSeating.filter(
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
    <Modal isOpen={open} close={tableModal.onClose} title={`Table ${selectTable}`} button="Add a Guess">
      <TableModal residents={residentsOnTable} />
    </Modal>
  );
}
