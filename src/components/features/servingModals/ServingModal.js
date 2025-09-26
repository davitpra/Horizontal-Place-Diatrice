"use client";

import { useTableModal } from "@/store/modals/useTableModal";
import { useTableNumber } from "@/store/seating/useTableNumber";
import { Modal } from "@/components/ui/Modal";
import { useMoreInfoModal } from "@/store/modals/useMoreInfoModal";
import { useSelectionModal } from "@/store/modals/useSelectionModal";
import { useMealBar } from "@/store/mealBar/useMealBar";
import { MoreInfoModal } from "./MoreInfoModal";
import { SelectionModal } from "./SelectionModal";
import TableHeader from "@/components/features/tableResident/TableHeader";
import ResidentInfo from "@/components/features/tableResident/ResidentInfo";
import CheckboxCell from "@/components/features/tableResident/CheckboxCell";
import ActionButtons from "@/components/features/tableResident/ActionButtons";
import { useHandleComplete } from "@/hooks/utils/useHandleComplete";
import { useCheckboxSelection } from "@/hooks/utils/useCheckboxSelection";
import { useTableFilters } from "@/hooks/utils/useTableFilters";
import { useTrayManagement } from "@/hooks/utils/useTrayManagement";
import { useModalManagement } from "@/hooks/utils/useModalManagement";
import { useMarkAsOut } from "@/hooks/utils/useMarkAsOut";

export function ServingModal({
  residentsOnSeating,
  menusOnSeating,
  mealsOnSeating,
  condition,
}) {
  // URL base para las imágenes
  const host = process.env.NEXT_PUBLIC_STRAPI_HOST;

  // Hooks para manejar los modales
  const tableModal = useTableModal();
  const InfoModal = useMoreInfoModal();
  const SelecModal = useSelectionModal();

  // Hooks para obtener el número de mesa y el número de comida
  const selectTable = useTableNumber((state) => state.tableNumber);
  const mealNumber = useMealBar((state) => state.mealNumber);

  // Custom hooks
  const {
    residentsOnTable,
    mealOnTable,
    updateMealOnTable,
    setMealOnTable,
  } = useTableFilters({
    selectTable,
    residentsOnSeating,
    mealsOnSeating,
    menusOnSeating,
    condition,
  });

  const {
    checkbox,
    checked,
    indeterminate,
    selectedItems: residentsToTray,
    handleSelectAll,
    handleSelectItem,
    resetSelection,
  } = useCheckboxSelection(updateMealOnTable);

  const { handleChangeToTray } = useTrayManagement({
    condition,
    mealNumber,
    onSuccess: () => {
      tableModal.onClose();
      resetSelection();
    },
  });

  const { handleMarkAsOut } = useMarkAsOut({
    condition,
    mealNumber,
    onSuccess: () => {
      tableModal.onClose();
      resetSelection();
    },
  });

  const {
    open,
    setOpen,
    residentInfo,
    index,
    handleOpenMoreInfo,
    handleSelectionModal,
  } = useModalManagement(tableModal, InfoModal, SelecModal);

  // Manejar la acción de completar un pedido
  const { handleComplete: handleCompleteAction } = useHandleComplete();

  const handleComplete = async (preference, index) => {
    const documentId = preference[index]?.documentId;
    const mealTypes = ["breakfast", "lunch", "supper"];
    const mealType = mealTypes[mealNumber];

    if (!mealType) {
      console.error("Invalid meal number:", mealNumber);
      return;
    }

    const newCompleteState = await handleCompleteAction({
      documentId,
      condition,
      mealType,
      isComplete: preference[index]?.complete
    });

    if (newCompleteState !== null) {
      setMealOnTable((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, complete: newCompleteState } : item
        )
      );
    }
  };

  return (
    <Modal
      isOpen={open}
      close={tableModal.onClose}
      title={`Table ${selectTable}`}
      button="Change to Tray"
      buttonAction={() => handleChangeToTray(residentsToTray)}
      button2="Mark as Out"
      button2Action={() => handleMarkAsOut(residentsToTray)}
    >
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <TableHeader
                checked={checked}
                onSelectAll={handleSelectAll}
                disabled={residentsOnTable.length === 0}
              />
              <tbody className="divide-y divide-gray-200 bg-white">
                {residentsOnTable.map((resident, index) => (
                  <tr key={resident.documentId}>
                    <td className="relative px-7 sm:w-12 sm:px-6">
                      <div className="absolute inset-y-0 left-0 hidden w-0.5 bg-indigo-600 group-has-checked:block" />
                      <CheckboxCell
                        checked={residentsToTray.some(({ documentId, onTray }) => documentId === updateMealOnTable[index]?.documentId && onTray === updateMealOnTable[index]?.onTray)}
                        onChange={() => handleSelectItem(updateMealOnTable[index])}
                        disabled={residentsOnTable.length === 0}
                        label={`Select ${resident.full_name}`}
                      />
                    </td>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <ResidentInfo resident={resident} mealInfo={updateMealOnTable[index]} />
                    </td>
                    <td className="hidden sm:block whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      {Object.entries(
                        updateMealOnTable[index]?.filterDrinks || {}
                      ).map(([key, value]) => (
                        <div
                          key={key}
                          className="py-0 grid grid-cols-2 gap-0 px-0"
                        >
                          <dt className="text-sm/6 font-medium text-gray-900 block">
                            {key}
                          </dt>
                          <dd className="text-sm/6 text-gray-700 mt-0 overflow-hidden text-ellipsis whitespace-nowrap text-left">
                            {typeof value === "boolean"
                              ? value
                                ? "Add"
                                : "none"
                              : value}
                          </dd>
                        </div>
                      ))}
                    </td>
                    <ActionButtons
                      resident={resident}
                      index={index}
                      isComplete={updateMealOnTable[index]?.complete}
                      onComplete={() => handleComplete(updateMealOnTable, index)}
                      onOpenInfo={handleOpenMoreInfo}
                      onChangeSelection={handleSelectionModal}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <MoreInfoModal
        resident={residentInfo}
        order={mealOnTable}
        index={index}
        setMealOnTable={setMealOnTable}
        complete={updateMealOnTable[index]?.complete}
      />
      <SelectionModal
        resident={residentInfo}
        order={mealOnTable}
        index={index}
        setMealOnTable={setMealOnTable}
        mealNumber={mealNumber}
      />
    </Modal>
  );
}