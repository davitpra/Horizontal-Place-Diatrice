import { createMenus } from "@/strapi/menus/createMenus";
import { getDayMenus } from "@/strapi/menus/getDayMenus";

export const useCreateMenus = async (residents, date) => {
  if (!residents || !Array.isArray(residents)) {
    throw new Error("Invalid residents array");
  }

  if (!date) {
    throw new Error("Date is required");
  }

  try {
    let dayMenus = await getDayMenus(date);

    // Filtrar los residentes que no tienen menús creados
    const residentsWithoutMenus = residents.filter(
      (resident) =>
        !dayMenus.some((menu) => menu.resident.documentId === resident.documentId)
    );

    if (residentsWithoutMenus.length === 0) {
      return dayMenus;
    }

    // Crear menús para los residentes que no tienen
    if (residentsWithoutMenus.length > 0) {
      await Promise.all(
        residentsWithoutMenus.map(async (resident) => {
          await createMenus({
            date,
            full_name: resident.full_name,
            documentId: resident.documentId,
          });
          console.log(`Menus created for ${resident.full_name}`);
        })
      );

      // Llamar nuevamente a getDayMenus para obtener la lista actualizada
      dayMenus = await getDayMenus(date);
    }

    return dayMenus;

  } catch (error) {
    console.error("Error in useCreateMenus:", error);
    throw error;
  }
};