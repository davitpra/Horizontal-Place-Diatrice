"use client";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { useMealBar } from "@/hooks/useMealBar";
import { useSelectionModal } from "@/hooks/useSelectionModal";
import { MEAL_OPTIONS } from "@/constants/mealOption";
import { useChangeBreakfast } from "@/hooks/useChangeBreakfast";
import { useDayBreakfastStore } from "@/store/useDayBreakfastStore";


export function SelectionModal({ resident, preferences }) {
  const [options, setOptions] = useState(MEAL_OPTIONS[0]);
  // to open or close the modal
  const SelectionModal = useSelectionModal();
  const [open, setOpen] = useState(SelectionModal.isOpen);

  const [meals, setMeals] = useState([]);
  const mealNumber = useMealBar((state) => state.mealNumber);

  const breakFast = useDayBreakfastStore ((state) => state.dayBreakfast);

  // Set the meals state when selection changes
  useEffect(() => {
    setMeals(preferences)
  }, [preferences]);

  // Close modal when the SelectionModal state changes
  useEffect(() => {
    setOpen(SelectionModal.isOpen);
  }, [SelectionModal.isOpen]);

  // Close modal when pick out of the modal
  useEffect(() => {
    if (!open) {
      SelectionModal.onClose();
    }
  }, [open]);

  // Handle change of the meal selection
  const handleChange = (event, key) => {
    const newValue = event.target.value;
    setMeals((prevMeals) => ({
      ...prevMeals,
      [key]: newValue,
    }));
  };

  // Handle save action
  const handleSave = async () => {
    const { documentId } = resident;
    if (!documentId) {
      console.error("No documentId found for resident:", resident);
      return;
    }
    console.log("resident:", resident);
    // NO ES EL DOCUMENT ID DEL BREAKFAST
    console.log("documentId:", documentId);
    try {
      await useChangeBreakfast({
        documentId,
        change: meals
      });
      console.log("Meal selection saved successfully:", meals); 
      SelectionModal.onClose();
    } catch (error) {
      console.error("Error saving meal selection:", error);
    }
  };

  return (
    <Modal
      isOpen={open}
      close={SelectionModal.onClose}
      title={resident.full_name}
      button="Save"
      buttonAction={handleSave}
    >
      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
        Complete
      </span>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <tbody className="divide-y divide-gray-200 bg-white">
                {resident && meals ? (
                  options.map(({ key, options }) => (
                    <tr key={key}>
                      <td className="py-3.5 pl-4 pr-3 text-left text-sm text-gray-900 sm:pl-0">
                        <label htmlFor={`select-${key}`}>{key}</label>
                      </td>
                      <td className="px-3 py-3.5 pr-3 text-left text-sm text-gray-900 sm:pl-0">
                        <div className="mt-2 grid grid-cols-1">
                          {key === "Observation" || key === "Additionals" ? (
                            <textarea
                              value={meals?.[key] || ""}
                              onChange={(event) => handleChange(event, key)}
                              className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            ></textarea>
                          ) : (
                            <select
                              id={`select-${key}`}
                              name={key}
                              value={meals?.[key] || ""}
                              onChange={(event) => handleChange(event, key)}
                              className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            >
                              {options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-3.5 pl-4 pr-3 text-left text-sm text-gray-900 sm:pl-0">
                      No meal selected
                    </td>
                    <td className="px-3 py-3.5 pr-3 text-left text-sm text-gray-900 sm:pl-0">
                      Please select a meal
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
}
