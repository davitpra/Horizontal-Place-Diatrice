import { createMenus } from "@/strapi/menus/createMenus";
import { getDayMenus } from "@/strapi/menus/getDayMenus";

// Helper to add delay
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const menus = async (residents, date) => {
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
      console.log(`Creating menus for ${residentsWithoutMenus.length} residents...`);
      
      await Promise.all(
        residentsWithoutMenus.map(async (resident) => {
          await createMenus({
            date,
            full_name: resident.full_name,
            documentId: resident.documentId,
            Seating: resident.Seating,
            slug: resident.slug,
          });
          console.log(`Menu created for ${resident.full_name}`);
        })
      );

      // Wait for Strapi to index the data ONLY when we created new menus
      console.log('Waiting for Strapi to index new menus...');
      await wait(500);

      // Llamar nuevamente a getDayMenus para obtener la lista actualizada
      dayMenus = await getDayMenus(date);
      
      // Validate that menus were created
      if (dayMenus.length === 0) {
        console.warn('No menus returned after creation. Retrying...');
        await wait(500);
        dayMenus = await getDayMenus(date);
      }
      
      console.log(`Total menus available: ${dayMenus.length}`);
    } else {
      console.log(`All menus already exist. Total: ${dayMenus.length}`);
    }

    return dayMenus;

  } catch (error) {
    console.error("Error in menus:", error);
    throw error;
  }
};