import { createSupper } from "@/lib/createSupper";
import { getDaySuppers } from "@/lib/getDaySuppers";

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
    // Obtener los desayunos existentes para la fecha
    let daySuppers = await getDaySuppers(date);
    // Filtrar los menús que no tienen un desayuno asociado
    const menusWithoutBreakfast = menus.filter((menu) => menu.supper === null);

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


          await createSupper({
            date,
            table: resident.table,
            full_name: menu.resident.full_name,
            Supper_preferences: resident.Supper_preferences,
            documentId: menu.documentId,
          });

          console.log(`Supper created for ${menu.resident.full_name}`);
        })
      );

      // Obtener la lista actualizada de desayunos
      daySuppers = await getDaySuppers(date);
    } 

    return daySuppers;
  } catch (error) {
    console.error("Error in useCreateSupper:", error);
    throw error;
  }
};