import { query } from "../../strapi";
import { getMenuSchedule } from "../../menuSchedule/getMenuSchedule";

export async function getDayBreakfasts(date) {
  let [breakfastMenu] = await getMenuSchedule(date) 
  return query(
    `breakfasts?filters[Date][$eq]=${date}&pagination[pageSize]=100`
  ).then((res) => {
    return res.data.map((breakFast) => {
      const { went_out_to_eat, complete, slug, documentId, table} = breakFast;
      //GET DAY OF WEEK
      let today = new Date();
      let dayOfWeek = today.getDay();

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
          water: breakFast?.water,
          Hotdrink: breakFast?.Hotdrink,
          Juice: breakFast?.Juice,
          Cereals: breakFast?.Cereals,
          Milk: breakFast?.Milk,
          eggs: breakFast?.eggs,
          toast: breakFast?.toast,
          feature: breakFast?.feature ? breakfastMenu?.data.feature : breakFast?.feature,
          FruitPlate: breakFast?.FruitPlate,
          Yogurt: breakFast?.Yogurt,
          Muffing: breakFast?.Muffing,
          additionals: breakFast?.additionals,
          Comment: breakFast?.Comment,
        }),
      ];
      const onTray = breakFast?.onTray;

      return {
        documentId,
        table,
        complete,
        went_out_to_eat,
        meals,
        onTray,
        slug,
      };
    });
  });
}
