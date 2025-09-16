import { createSupper } from "@/strapi/meals/supper/createSupper";
import { getDaySuppers } from "@/strapi/meals/supper/getDaySuppers";

export const useCreateSupper = async (residents, date, menus) => {
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
    // Obtener las cenas existentes para la fecha
    let daySuppers = await getDaySuppers(date);
    // Filtrar los menús que no tienen una cena asociada
    const menusWithoutSupper = menus.filter((menu) => menu.supper === null);

    if (menusWithoutSupper.length > 0) {
      // Crear cenas para los menús que no tienen
      await Promise.all(
        menusWithoutSupper.map(async (menu) => {
          const resident = residents.find(
            (resident) => resident.documentId === menu.resident.documentId
          );

          if (!resident) {
            console.log(
              `Resident not found for supper: ${menu.resident.full_name}`
            );
            return;
          }


          await createSupper({
            date,
            table: resident.table,
            full_name: menu.resident.full_name,
            supper_preferences: resident.Supper_preferences,
            documentId: menu.documentId,
          });
        })
      );

      // Obtener la lista actualizada de cenas
      daySuppers = await getDaySuppers(date);
    } 
    return daySuppers;
  } catch (error) {
    console.error("Error in useCreateSupper:", error);
    throw error;
  }
};