import { useMealBar } from "@/hooks/useMealBar";
import { useMoreInfoModal } from "@/hooks/useMoreInfoModal";
import { useSelectionModal } from "@/hooks/useSelectionModal";
import { useDayBreakfastStore } from "@/store/useDayBreakfastStore";
import { useDayMenusStore } from "@/store/useDayMenusStore";
import {
  FolderOpenIcon,
  FolderPlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { MoreInfoModal } from "./MoreInfoModal";
import { SelectionModal } from "./SelectionModal";
import { useMemo, useEffect, useState } from "react";
import { changeBreakfast } from "@/lib/changeBreakfast";

export function TableModal(residentsOnSeating) {
  const host = process.env.NEXT_PUBLIC_STRAPI_HOST;
  const mealNumber = useMealBar((state) => state.mealNumber);
  const dayBreakfast = useDayBreakfastStore((state) => state.dayBreakfast);
  const dayMenus = useDayMenusStore((state) => state.dayMenus);

  const [ResidentsOntable, setResidentsOnTable] = useState([]);
  // State to hold the resident information
  const [residentInfo, setResidentInfo] = useState({});
  // State to hold the preferences and index of the selected resident
  const [preferences, setPreferences] = useState([]);
  const [index, setIndex] = useState(0);

  const InfoModal = useMoreInfoModal();
  const SelecModal = useSelectionModal();

  // Estado adicional para rastrear los cambios en preferencesWithoutDrinks
  const [updatedPreferences, setUpdatedPreferences] = useState([]);

  function handleOpenMoreInfo(resident) {
    setResidentInfo(resident);
    InfoModal.onOpen();
  }

  function handleSelectionModal(resident) {
    setResidentInfo(resident);
    SelecModal.onOpen();
  }

  // Memoizar menusOnSeating para evitar cálculos innecesarios
  const menusOnSeating = useMemo(() => {
    return dayMenus.filter((menu) =>
      residentsOnSeating.residents.some(
        (resident) => resident.documentId === menu.resident.documentId
      )
    );
  }, [dayMenus, residentsOnSeating]);

  useEffect(() => {
    if (mealNumber === 0) {
      // Filtrar los desayunos que coinciden con los menús
      const breakfastOnSeating = dayBreakfast.filter((breakfast) =>
        menusOnSeating.some(
          (menu) => menu.breakfast.documentId === breakfast.documentId
        )
      );

      // Ordenar residentes y desayunos según el orden de menusOnSeating
      const sortedResidents = [...residentsOnSeating.residents].sort((a, b) => {
        const indexA = menusOnSeating.findIndex(
          (menu) => menu.resident.documentId === a.documentId
        );
        const indexB = menusOnSeating.findIndex(
          (menu) => menu.resident.documentId === b.documentId
        );
        return indexA - indexB;
      });

      const sortedBreakfasts = [...breakfastOnSeating].sort((a, b) => {
        const indexA = menusOnSeating.findIndex(
          (menu) => menu.breakfast.documentId === a.documentId
        );
        const indexB = menusOnSeating.findIndex(
          (menu) => menu.breakfast.documentId === b.documentId
        );
        return indexA - indexB;
      });

      // Actualizar el estado con los arrays ordenados
      setPreferences(sortedBreakfasts);
      setResidentsOnTable(sortedResidents);
    }
  }, [mealNumber, dayBreakfast, menusOnSeating, residentsOnSeating]);

  // Función para transformar las preferencias en un formato adecuado para la UI
  const preferencesWithoutDrinks = useMemo(() => {
    // Función auxiliar para filtrar las preferencias
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
      if (!Array.isArray(preferences)) {
        console.error("Preferences is not an array:", preferences);
        return [];
      }

      return preferences.map((preference) => {
        if (
          !preference ||
          !Array.isArray(preference.meals) ||
          !preference.meals[0]
        ) {
          console.error("Invalid preference object:", preference);
          return {};
        }
        // Filtrar las bebidas y otros campos no deseados
        const filteredMeals = filterDrinks(preference.meals[0]);
        // Incluir el valor de `complete` en el resultado
        return {
          filterDrinks: filteredMeals,
          complete: preference.complete,
          documentId: preference.documentId,
        };
      });
    } catch (error) {
      console.error("An error occurred while filtering preferences:", error);
      return [];
    }
  }, [preferences]);

  // Sincronizar updatedPreferences con preferencesWithoutDrinks
  useEffect(() => {
    setUpdatedPreferences(preferencesWithoutDrinks);
  }, [preferencesWithoutDrinks]);

  const handleComplete = async (preference, index) => {
    try {
      const documentId = preference.documentId;
      if (!documentId) {
        console.error("No documentId found for the selected preference.");
        return;
      }
      // Actualizar el estado en el backend si es necesario
      if (mealNumber === 0) {
        await changeBreakfast({
          documentId,
          complete: !preference?.complete, // Enviar el nuevo estado de `complete`
        });
      }

      // Actualizar el estado local
      setUpdatedPreferences((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, complete: !item.complete } : item
        )
      );
      console.log("Meal selection saved successfully.");
    } catch (error) {
      console.error("Error saving meal selection:", error);
    }
  };

  return (
    <>
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
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    To Serve
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {ResidentsOntable.map((resident, index) => (
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
                        updatedPreferences[index]?.filterDrinks || {}
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
                          handleComplete(updatedPreferences[index], index);
                        }}
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          updatedPreferences[index]?.complete
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : "bg-gray-50 text-gray-700 ring-gray-600/20"
                        }`}
                      >
                        {updatedPreferences[index]?.complete
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
        preferences={preferences}
        index={index}
        mealNumber={mealNumber}
        setPreferences={setPreferences}
        complete={updatedPreferences[index]?.complete}
      />
      <SelectionModal
        resident={residentInfo}
        preferences={preferences}
        index={index}
        setPreferences={setPreferences}
        mealNumber={mealNumber}
      />
    </>
  );
}
