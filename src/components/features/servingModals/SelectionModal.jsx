"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

// UI Components
import { Modal } from "@/components/ui/Modal";

// Store Hooks
import { useSelectionModal } from "@/store/modals/useSelectionModal";
import { useMenuScheduleStore } from "@/store/meals/useMenuScheduleStore";
import { useMealBar } from "@/store/mealBar/useMealBar";
import { useMealsStore } from "@/store/meals/useMealsStore";

// Constants and Utils
import { MEAL_OPTIONS } from "@/constants/mealOption";
import { MEAL_VALUES } from "@/constants/mealConstants";
import {
  transformOrder,
  reverseTransformOrder,
} from "@/utils/mealTransformations";
import { updateMeal } from "@/strapi/meals/updateMeal";

export function SelectionModal({ resident, order = [{}], index = 0 }) {
  // Store hooks
  const mealNumber = useMealBar((state) => state.mealNumber);
  const selectionModal = useSelectionModal();
  const [lunchMenu, supperMenu] = useMenuScheduleStore(
    (state) => state.menuSchedule
  );
  const updateMealItem = useMealsStore((state) => state.updateMealItem);

  // Local state
  const [meals, setMeals] = useState({});
  const [mealOptions, setMealOptions] = useState(() => [...MEAL_OPTIONS[0]]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Memoized values
  const currentOrder = useMemo(() => order[index], [order, index]);
  const currentMeals = useMemo(() => currentOrder?.meals?.[0], [currentOrder]);

  // Effect to update meal options based on menu data and meal number
  useEffect(() => {
    const getUpdatedOptions = () => {
      // Default to breakfast options
      if (mealNumber === 0) {
        return [...MEAL_OPTIONS[0]];
      }

      // Handle lunch options
      if (mealNumber === 1 && lunchMenu?.data) {
        return [...MEAL_OPTIONS[1]].map((item) => {
          const menuItem = lunchMenu.data[item.key];
          return menuItem
            ? { ...item, options: [MEAL_VALUES.NONE, menuItem] }
            : item;
        });
      }

      // Handle supper options
      if (mealNumber === 2 && supperMenu?.data) {
        return [...MEAL_OPTIONS[2]].map((item) => {
          const menuItem = supperMenu.data[item.key];
          return menuItem
            ? { ...item, options: [MEAL_VALUES.NONE, menuItem] }
            : item;
        });
      }

      return [...MEAL_OPTIONS[mealNumber]];
    };

    setMealOptions(getUpdatedOptions());
  }, [lunchMenu, supperMenu, mealNumber]);

  // Effect to update meals when order changes
  useEffect(() => {
    if (currentMeals) {
      const menuData = mealNumber === 1 ? lunchMenu?.data : mealNumber === 2 ? supperMenu?.data : undefined;
      const updatedOrder = transformOrder(currentMeals, mealNumber, menuData);
      setMeals(updatedOrder);
    } else {
      setMeals({});
    }
  }, [currentMeals, mealNumber, lunchMenu, supperMenu]);

  // Handle change of the meal selection
  const handleChange = useCallback((event, key) => {
    const newValue = event.target.value;
    setMeals((prevMeals) => ({
      ...prevMeals,
      [key]: newValue,
    }));
  }, []);

  // Handle save action
  const handleSave = useCallback(async () => {
    const documentId = currentOrder?.documentId;

    if (!documentId) {
      setError(
        `No meal order found for resident: ${resident?.full_name || "Unknown"}`
      );
      return;
    }

    try {
      setError("");
      setIsLoading(true);
      // reverse the transform order
      const menuData = mealNumber === 1 ? lunchMenu?.data : mealNumber === 2 ? supperMenu?.data : undefined;
      const savedMeals = reverseTransformOrder(meals, mealNumber, menuData);

      // update the meal item on the store
      const type = ["breakfast", "lunch", "supper"][mealNumber];
      updateMealItem(type, documentId, meals);

      // persist changes to Strapi
      await updateMeal({
        condition: type,
        documentId,
        options: savedMeals,
      });

      selectionModal.onClose();
    } catch (error) {
      console.error("Error saving meal selection:", error);
      setError("Failed to save meal selection. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [
    currentOrder,
    resident,
    meals,
    mealNumber,
    updateMealItem,
    selectionModal,
  ]);

  return (
    <Modal
      isOpen={selectionModal.isOpen}
      close={selectionModal.onClose}
      title={resident?.full_name || "Meal Selection"}
      button={isLoading ? "Saving..." : "Save"}
      buttonAction={handleSave}
      buttonDisabled={isLoading}
    >
      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          Complete
        </span>
        {error && (
          <span
            role="alert"
            className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20"
          >
            {error}
          </span>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="mt-8 flow-root"
        aria-label="Meal selection form"
      >
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table
              className="min-w-full divide-y divide-gray-300"
              role="grid"
              aria-label="Meal options"
            >
              <tbody className="divide-y divide-gray-200 bg-white">
                {resident && meals ? (
                  mealOptions.map(({ key, options }) => (
                    <tr key={key} role="row">
                      <td className="py-3.5 pl-4 pr-3 text-left text-sm text-gray-900 sm:pl-0">
                        <label
                          htmlFor={`select-${key}`}
                          className="block font-medium"
                        >
                          {key}
                        </label>
                      </td>
                      <td className="px-3 py-3.5 pr-3 text-left text-sm text-gray-900 sm:pl-0">
                        <div className="mt-2 grid grid-cols-1">
                          {key === "Comment" || key === "additionals" ? (
                            <textarea
                              id={`select-${key}`}
                              name={key}
                              value={meals?.[key] || ""}
                              onChange={(event) => handleChange(event, key)}
                              className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                              aria-label={`Enter ${key.toLowerCase()}`}
                              disabled={isLoading}
                            />
                          ) : (
                            <select
                              id={`select-${key}`}
                              name={key}
                              value={meals?.[key] || ""}
                              onChange={(event) => handleChange(event, key)}
                              className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                              aria-label={`Select ${key.toLowerCase()}`}
                              disabled={isLoading}
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
                  <tr role="row">
                    <td
                      colSpan={2}
                      className="py-3.5 pl-4 pr-3 text-left text-sm text-gray-900 sm:pl-0"
                      role="alert"
                    >
                      No meal options available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </Modal>
  );
}
