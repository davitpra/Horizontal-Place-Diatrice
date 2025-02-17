import { createMenus } from "@/lib/createMenus";
import { getDayMenus } from "@/lib/getDayMenus";

export const useCreateMenus = async (residents) => {
  const date = "2025-02-15";
  // let date = useGetFormattedDate();
  // Check if the menus for the day have been created for each resident and create them if they don't exist
  for (const resident of residents) {
    const dayMenus = await getDayMenus(date);
    const menuExists = dayMenus.data.some((menu) =>
      menu.slug.includes(resident.slug)
    );
    if (!menuExists) {
      await createMenus({
        date,
        full_name: resident.full_name,
        documentId: resident.documentId,
      });
      console.log(`Menus created for ${resident.full_name}`);
    }
  }
};
