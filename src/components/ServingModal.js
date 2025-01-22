"use client";

import { useState, useEffect } from "react";
import { useTableModal } from "../hooks/useTableModal";
import { useTableNumber } from "../hooks/useTableNumber";
import { TableModal } from "./TableModal";
import { useSeatingConfigure } from "@/hooks/useSeatingConfigure";
import { useMealBar } from "@/hooks/useMealBar";
import { useSortedResidents } from "@/hooks/useSortedResidents";
import { Modal } from "./Modal";

export function ServingModal({ residents }) {
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
    <Modal isOpen={open} close={tableModal.onClose} title={`Table ${selectTable}`} button="Add a Guess">
      <TableModal residents={residentsOnTable} />
    </Modal>
  );
}
