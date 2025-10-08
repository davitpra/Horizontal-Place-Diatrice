import { createSupper } from "@/strapi/meals/supper/createSupper";
import { getDaySuppers } from "@/strapi/meals/supper/getDaySuppers";

// Helper to add delay
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
      console.log(`Creating supper for ${menusWithoutSupper.length} menus...`);
      
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

          console.log(`Supper created for ${menu.resident.full_name}`);
        })
      );

      // Wait for Strapi to process ONLY when we created new suppers
      console.log('Waiting for Strapi to process new suppers...');
      await wait(500);

      // Obtener la lista actualizada de cenas
      daySuppers = await getDaySuppers(date);
      
      console.log(`Total suppers available: ${daySuppers.length}`);
    } else {
      console.log(`All suppers already exist. Total: ${daySuppers.length}`);
    } 
    return daySuppers;
  } catch (error) {
    console.error("Error in useCreateSupper:", error);
    throw error;
  }
};