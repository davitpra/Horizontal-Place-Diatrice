import { createBreakfast } from "@/lib/createBreakfast";
import { getDayBreakfasts } from "@/lib/getDayBreakfasts";

export const useCreateBreakfast = async (residents,date, menus) => {

    let dayBreakfast = await getDayBreakfasts(date);

    // Check if the breakfast for the day have been created for each resident and create them if they don't exist
    for (const resident of residents) {

        const { full_name, Breakfast_preferences } = resident;

        const breakfastExits = dayBreakfast.some((breakFast) =>
        breakFast.slug.includes(resident.slug)
        );

        if (!breakfastExits) {
        
        let documentId = menus.find((menu) => menu.slug.includes(resident.slug)).documentId

        await createBreakfast({
              date,
              full_name,
              breakFast: Breakfast_preferences,
              documentId,
            });
        console.log(`Breakfast created for ${resident.full_name}`);
        }
    }
  // get the last version of the day breakfast
  dayBreakfast = await getDayBreakfasts(date);
  return dayBreakfast;
}