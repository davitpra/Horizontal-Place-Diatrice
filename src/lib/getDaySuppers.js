import { getMenuSchedule } from "./getMenuSchedule";
import { query } from "./strapi";

export async function getDaySuppers(date) {
  let [supperMenu] = await getMenuSchedule(date) 
  return query(
    `dinners?filters[Date][$eq]=${date}&populate=*`
  ).then((res) => {
    return res.data.map((supper) => {
      const { onTray, complete, Slug, documentId, went_out_to_eat, table} = supper;

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
          water: supper?.water,
          Hotdrink: supper?.Hotdrink,
          Juice: supper?.Juice,
          Milk: supper?.Milk,
          additionals: supper?.additionals,
          Comment: supper?.Comment,
          option_1: supper?.option_1? supperMenu?.data.option_1 : supper?.option_1,
          option_2: supper?.option_2? supperMenu?.data.option_2 : supper?.option_2,
          half_half: supper?.half_half,
          side_1: supper?.side_1? supperMenu?.data.side_1 : supper?.side_1,
          side_2: supper?.side_2? supperMenu?.data.side_2 : supper?.side_2,
          side_3: supper?.side_3? supperMenu?.data.side_3 : supper?.side_3,
          side_4: supper?.side_4? supperMenu?.data.side_4 : supper?.side_4,
          dessert: supper?.dessert? supperMenu?.data.dessert : supper?.dessert,

        }),
      ];


      return {
        documentId,
        table,
        complete,
        went_out_to_eat,
        meals,
        onTray,
        slug: Slug,
      };
    });
  });
}
