"use client";

import { useState, useEffect, use } from "react";
import { Modal } from "@/components/ui/Modal";
import { useSelectionModal } from "@/store/modals/useSelectionModal";
import { MEAL_OPTIONS } from "@/constants/mealOption";
import { changeComplete } from "@/strapi/utils/changeComplete";
import { useMenuScheduleStore } from "@/store/meals/useMenuScheduleStore";
import { useMealBar } from "@/store/mealBar/useMealBar";

export function SelectionModal({
  resident,
  setOrder,
  order = [{}],
  index = 0,
}) {
  const ADD = "Add";
  const NONE = "none";

  console.log("resident", resident);
  console.log("order", order);
  console.log("index", index);

  // Get hooks
  const mealNumber = useMealBar((state) => state.mealNumber);

  // to open or close the modal
  const SelectionModal = useSelectionModal();

  // state to control the modal open/close
  const [open, setOpen] = useState(SelectionModal.isOpen);

  // state to hold the meal selection
  const [meals, setMeals] = useState({});

  // state to hold the meal options
  const [options, setOptions] = useState(MEAL_OPTIONS[0]);

  // Get menu data from the store
  const [lunchMenu, supperMenu] = useMenuScheduleStore((state) => state.menuSchedule);

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

  // Update meal options with menu data
  useEffect(() => {
    if (lunchMenu?.data) {
      const updatedLunchOptions = MEAL_OPTIONS[1].map((item) => {
        if (item.key === "salad") {
          return { ...item, options: ["none", lunchMenu.data.salad] };
        }
        if (item.key === "soup") {
          return { ...item, options: ["none", lunchMenu.data.soup] };
        }
        if (item.key === "option_1") {
          return { ...item, options: ["none", lunchMenu.data.option_1] };
        }
        if (item.key === "option_2") {
          return { ...item, options: ["none", lunchMenu.data.option_2] };
        }
        if (item.key === "dessert") {
          return { ...item, options: ["none", lunchMenu.data.dessert] };
        }
        return item;
      });

      MEAL_OPTIONS[1] = updatedLunchOptions;
    }

    if (supperMenu?.data) {
      const updatedSupperOptions = MEAL_OPTIONS[2].map((item) => {
        if (item.key === "option_1") {
          return { ...item, options: ["none", supperMenu.data.option_1] };
        }
        if (item.key === "option_2") {
          return { ...item, options: ["none", supperMenu.data.option_2] };
        }
        if (item.key === "side_1") {
          return { ...item, options: ["none", supperMenu.data.side_1] };
        }
        if (item.key === "side_2") {
          return { ...item, options: ["none", supperMenu.data.side_2] };
        }
        if (item.key === "side_3") {
          return { ...item, options: ["none", supperMenu.data.side_3] };
        }
        if (item.key === "side_4") {
          return { ...item, options: ["none", supperMenu.data.side_4] };
        }
        if (item.key === "dessert") {
          return { ...item, options: ["none", supperMenu.data.dessert] };
        }
        return item;
      });

      MEAL_OPTIONS[2] = updatedSupperOptions;
    }
  }, [lunchMenu, supperMenu]); // Added dependencies


  // Set the options based on the meal number
  useEffect(() => {
    setOptions(MEAL_OPTIONS[mealNumber]);
  }, [mealNumber]);


  // Transform order into a format suitable for the UI
  function transformorder(preference) {
    if (!preference || typeof preference !== "object") {
      console.error("Invalid preference object");
      return {};
    }
    return Object.entries(preference).reduce((acc, [key, value]) => {
      acc[key] = typeof value === "boolean" ? (value ? ADD : NONE) : value;
      return acc;
    }, {});
  }

  function reverseTransformorder(meals) {
    if (!meals || typeof meals !== "object") {
      console.error("Invalid meals object");
      return {};
    }
    return Object.entries(meals).reduce((acc, [key, value]) => {
      if (key === "FruitPlate" || key === "Yogurt" || key === "Muffing" || key === "Bacon" || key === "Pancake") {
        acc[key] = value === "Add" ? true : value === "none" ? false : value;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  // Set the meals state when selection changes
  useEffect(() => {
    if (
      order[index] &&
      Array.isArray(order[index].meals) &&
      order[index].meals[0]
    ) {
      const updatedorder = transformorder(
        order[index].meals[0]
      );
      setMeals(updatedorder);
    } else {
      setMeals({}); // Establecer un estado vacío si no hay preferencias
    }
  }, [order, index, open]);



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
    const documentId = order[index].documentId;
    if (!documentId) {
      console.error("No documentId found for resident:", resident.full_name);
      return;
    }
    try {
      const savedMeals = reverseTransformorder(meals);

      const neworder = order.map((preference, i) =>
        i === index
          ? {
            ...preference,
            meals: [savedMeals],
          }
          : preference
      );

      setOrder(neworder);
      await changeComplete({
        documentId,
        options: savedMeals,
      });
      console.log("Meal selection saved successfully");
      SelectionModal.onClose();
    } catch (error) {
      console.error("Error saving meal selection:", error);
    }
  };

  return (
    <Modal
      isOpen={open}
      close={SelectionModal.onClose}
      title={resident?.full_name || 'Meal Selection'}
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
                          {key === "Comment" || key === "additionals" ? (
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
