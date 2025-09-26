import { useMealsStore } from "@/store/meals/useMealsStore";
import { changeTray } from "@/strapi/utils/changeTray";

export const useTrayManagement = ({ condition, mealNumber, onSuccess }) => {
  const { updateMealItem } = useMealsStore();

  const handleChangeToTray = async (selectedResidents) => {
    console.log("handleChangeToTray initiated");

    console.log("selectedResidents", selectedResidents);
    try {
      const updatedTray = selectedResidents.map(({documentId, onTray} = {}) => ({
        documentId: documentId,
        onTray: !onTray,
      }));

      // Actualizar todos los pedidos en el backend
      await Promise.all(
        updatedTray.map((preference) =>
          changeTray({
            documentId: preference.documentId,
            onTray: preference.onTray,
            condition: condition,
          })
        )
      );

      const mealTypes = ["breakfast", "lunch", "supper"];
      const mealType = mealTypes[mealNumber];

      if (!mealType) {
        console.error("Invalid meal number:", mealNumber);
        throw new Error("Invalid meal number");
      }

      // Actualizar el store con el nuevo estado de onTray
      selectedResidents.forEach(({documentId, onTray} = {}) => {
        updateMealItem(mealType, documentId, { onTray: !onTray });
      });

      // Ejecutar callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error("Error saving all meal selections:", error);
      throw error;
    }
  };

  return {
    handleChangeToTray,
  };
};
