import { createMenus } from "@/lib/createMenus";
import { getDayMenus } from "@/lib/getDayMenus";

export const useCreateMenus = async (residents, date) => {
  const dayMenus = await getDayMenus(date);
  const Menus = dayMenus.data.map(({ slug, documentId }) => ({
    slug,
    documentId,
  }));

  // Check if the menus for the day have been created for each resident and create them if they don't exist
  for (const resident of residents) {
    const menuExists = dayMenus.data.some((menu) =>
      menu.slug.includes(resident.slug)
    );
    if (!menuExists) {
      const { slug, documentId } = await createMenus({
        date,
        full_name: resident.full_name,
        documentId: resident.documentId,
      });
      console.log(`Menus created for ${resident.full_name}`);

      // Agrega el objeto con slug y documentId al array Menus
      Menus.push({ slug, documentId });
    }
  }

  return Menus;
};
