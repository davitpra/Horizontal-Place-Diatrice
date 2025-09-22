import { useState, useEffect } from 'react';

export const useModalManagement = (tableModal, InfoModal, SelecModal) => {
  const [open, setOpen] = useState(tableModal.isOpen);
  const [residentInfo, setResidentInfo] = useState({});
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setOpen(tableModal.isOpen);
  }, [tableModal.isOpen]);

  useEffect(() => {
    if (!open) {
      tableModal.onClose();
    }
  }, [open]);

  const handleOpenMoreInfo = (resident, idx) => {
    setResidentInfo(resident);
    setIndex(idx);
    InfoModal.onOpen();
  };

  const handleSelectionModal = (resident, idx) => {
    setResidentInfo(resident);
    setIndex(idx);
    SelecModal.onOpen();
  };

  return {
    open,
    setOpen,
    residentInfo,
    index,
    handleOpenMoreInfo,
    handleSelectionModal,
  };
};
