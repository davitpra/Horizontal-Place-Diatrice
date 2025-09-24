"use client";

import { useTableModal } from "@/store/modals/useTableModal";
import { useTableNumber } from "@/store/seating/useTableNumber";
import { Modal } from "@/components/ui/Modal";
import { useMoreInfoModal } from "@/store/modals/useMoreInfoModal";
import { useSelectionModal } from "@/store/modals/useSelectionModal";
import { useMealBar } from "@/store/mealBar/useMealBar";
import { MoreInfoModal } from "./MoreInfoModal";
import { SelectionModal } from "./SelectionModal";
import {
  FolderOpenIcon,
  FolderPlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useHandleComplete } from "@/hooks/utils/useHandleComplete";
import { useCheckboxSelection } from "@/hooks/utils/useCheckboxSelection";
import { useTableFilters } from "@/hooks/utils/useTableFilters";
import { useTrayManagement } from "@/hooks/utils/useTrayManagement";
import { useModalManagement } from "@/hooks/utils/useModalManagement";

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
    >
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                    <div className="group absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1">
                      <input
                        ref={checkbox}
                        type="checkbox"
                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                        checked={checked}
                        onChange={handleSelectAll}
                        disabled={residentsOnTable.length === 0}
                      />
                    </div>
                  </th>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Name
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    To Serve
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {residentsOnTable.map((resident, index) => (
                  <tr key={resident.documentId}>
                    <td className="relative px-7 sm:w-12 sm:px-6">
                      <div className="absolute inset-y-0 left-0 hidden w-0.5 bg-indigo-600 group-has-checked:block" />
                      <div className="absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1">
                        <input
                          type="checkbox"
                          className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                          checked={residentsToTray.some(({documentId, onTray}) => documentId === updateMealOnTable[index]?.documentId && onTray === updateMealOnTable[index]?.onTray)}
                          onChange={() => handleSelectItem(updateMealOnTable[index])}
                          disabled={residentsOnTable.length === 0}
                        />
                        <svg
                          className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            className="opacity-0 group-has-checked:opacity-100"
                            d="M3 8L6 11L11 3.5"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            className="opacity-0 group-has-indeterminate:opacity-100"
                            d="M3 7H11"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="size-11 shrink-0">
                          {resident.Picture?.url ? (
                            <img
                              alt={`${resident.full_name} image`}
                              src={`${host}${resident.Picture.url}`}
                              className="size-11 rounded-full"
                            />
                          ) : (
                            <UserIcon
                              className="size-11 rounded-full"
                              strokeWidth={0.2}
                            />
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-900">
                            {resident.full_name}
                          </p>
                          <p className="mt-1 text-gray-500">
                            Room {resident.roomId}
                            {updateMealOnTable[index]?.onTray && !updateMealOnTable[index]?.went_out_to_eat ? (
                              <span className="ml-2 rounded-md bg-yellow-50 px-1.5 py-0.5 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-500 dark:inset-ring-yellow-400/20">
                                on tray
                              </span>
                            ) : null}
                            {updateMealOnTable[index]?.went_out_to_eat ? (
                              <span className="ml-2 rounded-md bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-800 inset-ring inset-ring-red-600/20 dark:bg-red-400/10 dark:text-red-500 dark:inset-ring-red-400/20">
                                Out
                              </span>
                            ) : null}
                          </p>
                        </div>
                      </div>
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
                      <button
                        onClick={() => handleOpenMoreInfo(resident, index)}
                        className="hidden sm:block text-indigo-600 hover:text-indigo-900"
                      >
                        View all..
                      </button>
                    </td>
                    <td className="sm:hidden whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <FolderOpenIcon
                        className="sm:hidden h-6 w-6"
                        onClick={() => handleOpenMoreInfo(resident, index)}
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <button
                        onClick={() => handleComplete(updateMealOnTable, index)}
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          updateMealOnTable[index]?.complete
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : "bg-gray-50 text-gray-700 ring-gray-600/20"
                        }`}
                      >
                        {updateMealOnTable[index]?.complete
                          ? "Complete"
                          : "No Complete"}
                      </button>
                    </td>
                    <td className="relative whitespace-nowrap py-5 pl-3 pr-2 text-right text-sm font-medium sm:pr-0">
                      <button
                        className="hidden sm:block text-indigo-600 hover:text-indigo-900"
                        onClick={() => handleSelectionModal(resident, index)}
                      >
                        Change Selection
                        <span className="sr-only">, {resident.full_name}</span>
                      </button>
                      <FolderPlusIcon
                        className="sm:hidden h-6 w-6"
                        onClick={() => handleSelectionModal(resident, index)}
                      />
                    </td>
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