import { useMealsStore } from "@/store/meals/useMealsStore";
import { changeOut } from "@/strapi/utils/changeOut";

export const useMarkAsOut = ({ condition, mealNumber, onSuccess }) => {
  const { updateMealItem } = useMealsStore();

  const handleMarkAsOut = async (residentsToOut) => {
    try {
      const updatedResidentsToOut = residentsToOut.map(({documentId, went_out_to_eat} = {}) => ({
        documentId: documentId,
        went_out_to_eat: !went_out_to_eat,
        complete: false,
      }));

      await Promise.all(
        updatedResidentsToOut.map((preference) =>
          changeOut({
              documentId: preference.documentId,
              went_out_to_eat: preference.went_out_to_eat,
              complete: preference.complete,
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

      updatedResidentsToOut.forEach((preference) => {
        updateMealItem(mealType, preference.documentId, {
          went_out_to_eat: preference.went_out_to_eat,
          complete: preference.complete,
        });
      });
      onSuccess();
    } catch (error) {
      console.error("Error marking as out:", error);
      throw error;
    }
  };

  return { handleMarkAsOut };
};