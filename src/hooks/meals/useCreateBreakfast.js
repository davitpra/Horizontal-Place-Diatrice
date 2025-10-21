import { createBreakfast } from "@/strapi/meals/breakfast/createBreakfast";
import { getDayBreakfasts } from "@/strapi/meals/breakfast/getDayBreakfasts";

// Helper to add delay
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getOrCreateBreakfast = async (residents, date, menus) => {
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
      console.log(`Creating breakfast for ${menusWithoutBreakfast.length} menus...`);
      
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

          // Excluir el atributo id de Breakfast_preferences
          const { id, ...BreakfastPreference } = resident.Breakfast_preferences || {};

          await createBreakfast({
            date,
            table: resident.table,
            full_name: menu.resident.full_name,
            breakFast: BreakfastPreference,
            documentId: menu.documentId,
          });

          console.log(`Breakfast created for ${menu.resident.full_name}`);
        })
      );

      // Wait for Strapi to process ONLY when we created new breakfasts
      console.log('Waiting for Strapi to process new breakfasts...');
      await wait(500);

      // Obtener la lista actualizada de desayunos
      dayBreakfast = await getDayBreakfasts(date);
      
      console.log(`Total breakfasts available: ${dayBreakfast.length}`);
    } else {
      console.log(`All breakfasts already exist. Total: ${dayBreakfast.length}`);
    } 
    return dayBreakfast;
  } catch (error) {
    console.error("Error in getOrCreateBreakfast:", error);
    throw error;
  }
};