"use client";

import { useState, useEffect, useMemo } from "react";
import { useTableModal } from "../hooks/useTableModal";
import { useTableNumber } from "../hooks/useTableNumber";
import { Modal } from "./Modal";
import { useMoreInfoModal } from "@/hooks/useMoreInfoModal";
import { useSelectionModal } from "@/hooks/useSelectionModal";
import { useMealBar } from "@/hooks/useMealBar";
import { MoreInfoModal } from "./MoreInfoModal";
import { SelectionModal } from "./SelectionModal";
import {
  FolderOpenIcon,
  FolderPlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { changeBreakfast } from "@/lib/changeBreakfast";

export function ServingModal({ residentsOnSeating, dayMenus, dayBreakfast }) {
  // URL base para las imágenes
  const host = process.env.NEXT_PUBLIC_STRAPI_HOST;

  // Hooks para manejar los modales
  const tableModal = useTableModal(); // Modal principal para la tabla
  const InfoModal = useMoreInfoModal(); // Modal para mostrar más información
  const SelecModal = useSelectionModal(); // Modal para cambiar selecciones

  // Estados locales
  const [open, setOpen] = useState(tableModal.isOpen); // Estado para abrir/cerrar el modal principal
  const [residentsOntable, setResidentsOnTable] = useState(residentsOnSeating || []); // Residentes filtrados por mesa
  const [residentInfo, setResidentInfo] = useState({}); // Información del residente seleccionado
  const [order, setOrder] = useState([]); // Pedidos filtrados por mesa
  const [index, setIndex] = useState(0); // Índice del residente seleccionado
  const [updatedOrder, setUpdatedOrders] = useState([]); // Pedidos actualizados sin bebidas

  // Hooks para obtener el número de mesa y el número de comida
  const selectTable = useTableNumber((state) => state.tableNumber);
  const mealNumber = useMealBar((state) => state.mealNumber);

  // Sincronizar el estado `open` con el estado del modal principal
  useEffect(() => {
    setOpen(tableModal.isOpen);
  }, [tableModal.isOpen]);

  // Cerrar el modal principal si se clickea afuera de él modal
  useEffect(() => {
    if (!open) {
      tableModal.onClose();
    }
  }, [open]);

  // Abrir el modal de más información para un residente específico
  function handleOpenMoreInfo(resident) {
    setResidentInfo(resident);
    InfoModal.onOpen();
  }

  // Abrir el modal de selección para un residente específico
  function handleSelectionModal(resident) {
    setResidentInfo(resident);
    SelecModal.onOpen();
  }

  // Filtrar residentes, menús y desayunos según la mesa seleccionada
  useEffect(() => {
    // Filtrar residentes por la mesa seleccionada
    const filterResidentsByTable = residentsOnSeating?.filter(
      (resident) => resident.table === selectTable
    ) || [];
    setResidentsOnTable(filterResidentsByTable);

    // Filtrar menús que correspondan a los residentes de la mesa
    const menusOnTable = dayMenus?.filter((menu) =>
      filterResidentsByTable.some(
        (resident) => resident.documentId === menu.resident?.documentId
      )
    ) || [];

    // Filtrar desayunos que correspondan a los menús de la mesa
    const breakFastOnTable = dayBreakfast?.filter((breakfast) =>
      menusOnTable.some(
        (menu) => menu.breakfast?.documentId === breakfast?.documentId
      )
    ) || [];

    // Actualizar el estado con los desayunos filtrados
    setOrder(breakFastOnTable);
  }, [residentsOnSeating, selectTable, dayMenus, dayBreakfast]);

  // Filtrar las bebidas de los pedidos
  const ordersWithoutDrinks = useMemo(() => {
    const filterDrinks = (meals) => {
      const {
        water,
        Hotdrink,
        Juice,
        Cereals,
        Comment,
        ...filteredPreference
      } = meals;
      return filteredPreference;
    };

    try {
      if (!Array.isArray(order)) {
        console.error("order is not an array:", order);
        return [];
      }

      // Filtrar las bebidas de cada pedido
      return order.map((preference) => {
        if (
          !preference ||
          !Array.isArray(preference.meals) ||
          !preference.meals[0]
        ) {
          console.error("Invalid preference object:", preference);
          return {};
        }
        const filteredMeals = filterDrinks(preference.meals[0]);
        return {
          filterDrinks: filteredMeals,
          complete: preference.complete,
          documentId: preference.documentId,
        };
      });
    } catch (error) {
      console.error("An error occurred while filtering order:", error);
      return [];
    }
  }, [order]);

  // Actualizar el estado con los pedidos sin bebidas
  useEffect(() => {
    setUpdatedOrders(ordersWithoutDrinks);
  }, [ordersWithoutDrinks]);

  // Manejar la acción de completar un pedido
  const handleComplete = async (preference, index) => {
    try {
      const documentId = preference?.documentId;
      if (!documentId) {
        console.error("No documentId found for the selected preference.");
        return;
      }
      if (mealNumber === 0) {
        await changeBreakfast({
          documentId,
          complete: !preference?.complete,
        });
      }

      // Actualizar el estado local con el nuevo estado de `complete`
      setUpdatedOrders((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, complete: !item.complete } : item
        )
      );
      console.log("Meal selection saved successfully.");
    } catch (error) {
      console.error("Error saving meal selection:", error);
    }
  };

  // Manejar la acción de completar todos los pedidos
  const handleCompleteAll = async () => {
    try {
      const updatedOrdersWithComplete = updatedOrder.map((item) => ({
        ...item,
        complete: true,
      }));

      // Actualizar todos los pedidos en el backend
      await Promise.all(
        updatedOrdersWithComplete.map((preference) =>
          changeBreakfast({
            documentId: preference.documentId,
            complete: preference.complete,
          })
        )
      );

      // Actualizar el estado local con todos los pedidos completados
      setUpdatedOrders(updatedOrdersWithComplete);
      console.log("All meal selections saved successfully.");
    } catch (error) {
      console.error("Error saving all meal selections:", error);
    }
  };

  // Renderizar el modal principal con la tabla de residentes y pedidos
  return (
    <Modal
      isOpen={open}
      close={tableModal.onClose}
      title={`Table ${selectTable}`}
      button="Complete All"
      buttonAction={handleCompleteAll}
    >
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
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
                {residentsOntable.map((resident, index) => (
                  <tr key={resident.documentId}>
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
                          <div className="font-medium text-gray-900">
                            {resident.full_name}
                          </div>
                          <div className="mt-1 text-gray-500">
                            Room {resident.roomId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:block whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      {Object.entries(
                        updatedOrder[index]?.filterDrinks || {}
                      ).map(([key, value]) => (
                        <div key={key} className="py-0 grid grid-cols-2 gap-0 px-0">
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
                        onClick={() => {
                          handleOpenMoreInfo(resident);
                          setIndex(index);
                        }}
                        className="hidden sm:block text-indigo-600 hover:text-indigo-900"
                      >
                        View all..
                      </button>
                    </td>
                    <td className="sm:hidden whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <FolderOpenIcon
                        className="sm:hidden h-6 w-6"
                        onClick={() => {
                          handleOpenMoreInfo(resident);
                          setIndex(index);
                        }}
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <button
                        onClick={() => {
                          handleComplete(updatedOrder[index], index);
                        }}
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          updatedOrder[index]?.complete
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : "bg-gray-50 text-gray-700 ring-gray-600/20"
                        }`}
                      >
                        {updatedOrder[index]?.complete
                          ? "Complete"
                          : "No Complete"}
                      </button>
                    </td>
                    <td className="relative whitespace-nowrap py-5 pl-3 pr-2 text-right text-sm font-medium sm:pr-0">
                      <button
                        href="#"
                        className="hidden sm:block text-indigo-600 hover:text-indigo-900"
                        onClick={() => {
                          handleSelectionModal(resident);
                          setIndex(index);
                        }}
                      >
                        Change Selection
                        <span className="sr-only">, {resident.full_name}</span>
                      </button>
                      <FolderPlusIcon
                        className="sm:hidden h-6 w-6"
                        onClick={() => {
                          handleSelectionModal(resident);
                          setIndex(index);
                        }}
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
        order={order}
        index={index}
        mealNumber={mealNumber}
        setOrder={setOrder}
        complete={updatedOrder[index]?.complete}
      />
      <SelectionModal
        resident={residentInfo}
        order={order}
        index={index}
        setOrder={setOrder}
        mealNumber={mealNumber}
      />
    </Modal>
  );
}