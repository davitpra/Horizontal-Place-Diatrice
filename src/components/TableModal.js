import { useMealBar } from "@/app/hooks/useMealBar";
import { useMoreInfoModal } from "@/app/hooks/useMoreInfoModal";
import {
  FolderOpenIcon,
  FolderPlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { MoreInfoModal } from "./MoreInfoModal";

export function TableModal(residents) {
  const host = process.env.NEXT_PUBLIC_STRAPI_HOST;
  const mealNumber = useMealBar((state) => state.mealNumber);

  const [residentInfo, setResidentInfo] = useState({});
  // Función para abrir el modal
  const InfoModal = useMoreInfoModal();

  function handleOpenModal(resident) {
    setResidentInfo(resident);
    InfoModal.onOpen();
  }

  // Función para quitar elementos con ciertas claves
  function removeKeysFromObject(obj, keysToRemove) {
    const newObj = { ...obj };
    keysToRemove.forEach((key) => {
      delete newObj[key];
    });
    return newObj;
  }

  // Claves a quitar
  const keyForDrinks = ["Water", "Hotdrink", "Juice", "Milk"];

  // Array resultante
  const mealWithoutDrinks = residents.residents.map((resident) =>
    removeKeysFromObject(resident.meals[mealNumber], keyForDrinks)
  );

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
                {residents.residents.map((resident, index) => (
                  <tr key={resident.id}>
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
                      {Object.entries(mealWithoutDrinks[index]).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="py-0 grid grid-cols-2 gap-0 px-0"
                          >
                            <dt className="text-sm/6 font-medium text-gray-900 block">
                              {key}
                            </dt>
                            <dd className="text-sm/6 text-gray-700 mt-0 overflow-hidden text-ellipsis whitespace-nowrap text-left">
                              {value}
                            </dd>
                          </div>
                        )
                      )}
                      <button onClick={()=>handleOpenModal(resident)} className="hidden sm:block text-indigo-600 hover:text-indigo-900">
                        View all..
                      </button>
                    </td>
                    <td className="sm:hidden whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <FolderOpenIcon className="sm:hidden h-6 w-6" onClick={()=>handleOpenModal(resident)}/>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Complete
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-5 pl-3 pr-2 text-right text-sm font-medium sm:pr-0">
                      <a
                        href="#"
                        className="hidden sm:block text-indigo-600 hover:text-indigo-900"
                      >
                        Change Selection
                        <span className="sr-only">, {resident.full_name}</span>
                      </a>
                      <FolderPlusIcon className="sm:hidden h-6 w-6" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <MoreInfoModal resident={residentInfo} />
    </>
  );
}
