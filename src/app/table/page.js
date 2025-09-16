"use client";
import { Table } from "../../components/ui/Table";
import Title from "../../components/ui/Title";
import { MealBar } from "../../components/ui/MealBar";
import { getAllResidents } from "@/strapi/residents/getAllResidents";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  FolderOpenIcon,
  FolderPlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Wraper } from "@/components/ui/Wraper";

const rawData = [
  {
    documentId: 1,
    full_name: "John Doe",
    roomId: "101",
    seating: 1,
    mealPreference: "Vegetarian",
    dietaryNeeds: "Gluten-Free",
    drinks: { Water: true, Juice: false, Soda: false },
    complete: false,
  },
  {
    documentId: 2,
    full_name: "Jane Smith",
    roomId: "102",
    seating: 2,
    mealPreference: "Non-Vegetarian",
    dietaryNeeds: "None",
    drinks: { Water: true, Juice: true, Soda: false },
    complete: true,
  },
];

export default function Tables() {
  // Estados para checkbox
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [residentsToTray, setResidentsToTray] = useState([]);
  const [residentsOntable, setResidentsOntable] = useState(rawData);
  const [updateMealOnTable, setUpdatedMealOnTable] = useState(rawData); // Pedidos actualizados sin bebidas

  const observations = [
    "Overview of the meals being served, meal preferences and dietary needs.",
  ];

  // funcionalidad para checkbox
  useLayoutEffect(() => {
    const isIndeterminate =
      residentsToTray.length > 0 &&
      residentsToTray.length < residentsOntable.length;
    setChecked(residentsToTray.length === residentsOntable.length);
    setIndeterminate(isIndeterminate);
    // Protege contra checkbox.current undefined
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [residentsToTray, residentsOntable]);

  return (
    <>
      <Title title={"Summary"} observations={observations} />
      <MealBar />
      <Wraper>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <div className="group absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1">
                        {/* Checkbox select-all en el header */}
                        <input
                          ref={checkbox}
                          type="checkbox"
                          className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                          checked={checked}
                          onChange={() => {
                            if (checked) {
                              setResidentsToTray([]);
                              setChecked(false);
                            } else {
                              setResidentsToTray(
                                (updateMealOnTable || []).map(
                                  (r) => r.documentId
                                )
                              );
                              setChecked(true);
                            }
                          }}
                          disabled={residentsOntable.length === 0}
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
                  {residentsOntable.map((resident, index) => (
                    <tr key={resident.documentId}>
                      <td className="relative px-7 sm:w-12 sm:px-6">
                        <div className="absolute inset-y-0 left-0 hidden w-0.5 bg-indigo-600 group-has-checked:block" />

                        <div className="absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1">
                          {/* Checkbox por fila: no usar la misma ref, calcular checked por id */}
                          <input
                            type="checkbox"
                            className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                            checked={residentsToTray.includes(
                              updateMealOnTable[index]?.documentId
                            )}
                            onChange={(e) => {
                              const id = updateMealOnTable[index].documentId;
                              setResidentsToTray((prev) => {
                                if (e.target.checked) {
                                  // evitar duplicados
                                  if (prev.includes(id)) return prev;
                                  return [...prev, id];
                                } else {
                                  return prev.filter((pid) => pid !== id);
                                }
                              });
                            }}
                            disabled={residentsOntable.length === 0}
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
                            handleComplete(updateMealOnTable, index);
                          }}
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
                          href="#"
                          className="hidden sm:block text-indigo-600 hover:text-indigo-900"
                          onClick={() => {
                            handleSelectionModal(resident);
                            setIndex(index);
                          }}
                        >
                          Change Selection
                          <span className="sr-only">
                            , {resident.full_name}
                          </span>
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
      </Wraper>
    </>
  );
}
