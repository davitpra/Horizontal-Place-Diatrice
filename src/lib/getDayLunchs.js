import { getMenuSchedule } from "./getMenuSchedule";
import { query } from "./strapi";

export async function getDayLunchs(date) {
  let [lunchMenu] = await getMenuSchedule(date) 
  console.log(lunchMenu.data)
  return query(
    `lunches?filters[Date][$eq]=${date}&populate=*`
  ).then((res) => {
    return res.data.map((lunch) => {
      const { onTray, complete, Slug, documentId, went_out_to_eat} = lunch;

      // Helper function to filter the valid properties
      function filterValidProperties(obj) {
        return Object.fromEntries(
          Object.entries(obj).filter(
            ([key, value]) =>
              value !== undefined &&
              value !== null &&
              value !== "" &&
              value !== false &&
              value !== "none"
          )
        );
      }

      // Array of meals preferences with the valid properties
      const meals = [
        filterValidProperties({
          water: lunch?.water,
          Hotdrink: lunch?.Hotdrink,
          Juice: lunch?.Juice,
          Milk: lunch?.Milk,
          additionals: lunch?.additionals,
          soup: lunch?.soup ? lunchMenu?.data.soup : lunch?.soup,
          salad: lunch?.salad? lunchMenu?.data.salad : lunch?.soup,
          option_1: lunch?.option_1? lunchMenu?.data.option_1 : lunch?.option_1,
          // description_option_1: lunch?.option_1? lunchMenu?.data.description_option_1 : lunch?.option_1,
          option_2: lunch?.option_2? lunchMenu?.data.option_2 : lunch?.option_2,
          // description_option_2: lunch?.option_2? lunchMenu?.data.description_option_2 : lunch?.option_2,
          half_half: lunch?.half_half,
          dessert: lunch?.dessert? lunchMenu?.data.dessert : lunch?.dessert,
          Comment: lunch?.Comment,
        }),
      ];


      return {
        documentId,
        complete,
        went_out_to_eat,
        meals,
        onTray,
        slug: Slug,
      };
    });
  });
}
