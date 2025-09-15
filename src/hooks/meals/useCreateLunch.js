import { createLunch } from "@/strapi/meals/lunch/createLunch";
import { getDayLunchs } from "@/strapi/meals/lunch/getDayLunchs";

export const useCreateLunch = async (residents, date, menus) => {
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
    let dayLunchs = await getDayLunchs(date);
    // Filtrar los menús que no tienen un desayuno asociado
    const menusWithoutBreakfast = menus.filter((menu) => menu.lunch === null);

    if (menusWithoutBreakfast.length > 0) {
      // Crear desayunos para los menús que no tienen
      await Promise.all(
        menusWithoutBreakfast.map(async (menu) => {
          const resident = residents.find(
            (resident) => resident.documentId === menu.resident.documentId
          );

          if (!resident) {
            console.log(
              `Resident not found for menu: ${menu.resident.full_name}`
            );
            return;
          }


          await createLunch({
            date,
            table: resident.table,
            full_name: menu.resident.full_name,
            lunch_preferences: resident.Lunch_preferences,
            documentId: menu.documentId,
          });

          console.log(`Lunch created for ${menu.resident.full_name}`);
        })
      );

      // Obtener la lista actualizada de desayunos
      dayLunchs = await getDayLunchs(date);
    } 

    return dayLunchs;
  } catch (error) {
    console.error("Error in useCreateBreakfast:", error);
    throw error;
  }
};