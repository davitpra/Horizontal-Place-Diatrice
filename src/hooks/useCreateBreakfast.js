import { createBreakfast } from "@/lib/createBreakfast";
import { getDayBreakfasts } from "@/lib/getDayBreakfasts";

export const useCreateBreakfast = async (residents, date, menus) => {
  if (!residents || !Array.isArray(residents)) {
    throw new Error("Invalid residents array");
  }

  if (!date) {
    throw new Error("Date is required");
  }

  if (!menus || !Array.isArray(menus)) {
    throw new Error("Invalid menus array");
  }

  try {
    // Obtener los desayunos existentes para la fecha
    let dayBreakfast = await getDayBreakfasts(date);

    // Filtrar los menús que no tienen un desayuno asociado
    const menusWithoutBreakfast = menus.filter((menu) => menu.breakfast === null);

    if (menusWithoutBreakfast.length > 0) {
      console.log(`Creating breakfasts for ${menusWithoutBreakfast.length} menus...`);

      // Crear desayunos para los menús que no tienen
      await Promise.all(
        menusWithoutBreakfast.map(async (menu) => {
          const resident = residents.find(
            (resident) => resident.documentId === menu.resident.documentId
          );

          if (!resident) {
            console.warn(`Resident not found for menu with documentId: ${menu.documentId}`);
            return;
          }

          // Excluir el atributo id de Breakfast_preferences
          const { id, ...BreakfastPreference } = resident.Breakfast_preferences || {};

          await createBreakfast({
            date,
            full_name: menu.resident.full_name,
            breakFast: BreakfastPreference,
            documentId: menu.documentId,
          });

          console.log(`Breakfast created for ${menu.resident.full_name}`);
        })
      );

      // Obtener la lista actualizada de desayunos
      dayBreakfast = await getDayBreakfasts(date);
    } 
    return dayBreakfast;
  } catch (error) {
    console.error("Error in useCreateBreakfast:", error);
    throw error;
  }
};