import { createLunch } from "@/strapi/meals/lunch/createLunch";
import { getDayLunchs } from "@/strapi/meals/lunch/getDayLunchs";

// Helper to add delay
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getOrCreateLunch = async (residents, date, menus) => {
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
    // Obtener los almuerzos existentes para la fecha
    let dayLunchs = await getDayLunchs(date);
    
    // Filtrar los menús que no tienen un almuerzo asociado
    const menusWithoutLunch = menus.filter((menu) => menu.lunch === null);

    if (menusWithoutLunch.length > 0) {
      console.log(`Creating lunch for ${menusWithoutLunch.length} menus...`);
      
      // Crear almuerzos para los menús que no tienen
      await Promise.all(
        menusWithoutLunch.map(async (menu) => {
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

      // Wait for Strapi to process ONLY when we created new lunches
      console.log('Waiting for Strapi to process new lunches...');
      await wait(500);

      // Obtener la lista actualizada de almuerzos
      dayLunchs = await getDayLunchs(date);
      
      console.log(`Total lunches available: ${dayLunchs.length}`);
    } else {
      console.log(`All lunches already exist. Total: ${dayLunchs.length}`);
    } 

    return dayLunchs;
  } catch (error) {
    console.error("Error in getOrCreateLunch:", error);
    throw error;
  }
};