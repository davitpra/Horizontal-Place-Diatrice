"use client";

import { changeComplete } from "@/strapi/utils/changeComplete";
import { useMealsStore } from "@/store/meals/useMealsStore";

export const useHandleComplete = () => {
  const { updateMealItem } = useMealsStore();

  const handleComplete = async ({ documentId, condition, mealType, isComplete }) => {
    try {
      if (!documentId) {
        console.error("No documentId found for the selected preference.");
        return null;
      }

      // Actualizar el backend
      await changeComplete({
        documentId,
        complete: !isComplete,
        condition,
      });

      // Actualizar el estado en el store
      updateMealItem(mealType, documentId, { complete: !isComplete });
      console.log("Meal selection saved successfully.");

      return !isComplete; // Retornamos el nuevo estado
    } catch (error) {
      const readable =
        error?.message ||
        (typeof error === "object" ? JSON.stringify(error) : String(error));
      console.error("Error saving meal selection:", readable);
      return null;
    }
  };

  return { handleComplete };
};
