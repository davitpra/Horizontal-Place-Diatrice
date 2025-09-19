import { query } from "../../strapi";

export async function getDayBreakfasts(date) {
  return query(
    `breakfasts?filters[Date][$eq]=${date}`
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
          FruitPlate: breakFast?.FruitPlate,
          Yogurt: breakFast?.Yogurt,
          Muffing: breakFast?.Muffing,
          additionals: breakFast?.additionals,
          Comment: breakFast?.Comment,
        }),
      ];

      // if it is Thursday, add pancakes to breakFast
      if (dayOfWeek === 4) {
        if (breakFast?.Pancake) {
          meals[0].Pancake = true;
        } else {
          meals[0].Pancake = false;
        }
      }

      // if it is Sunday or Wednesday, add bacon to breakFast
      if (dayOfWeek === 0 || dayOfWeek === 3) {
        if (breakFast?.Bacon) {
          meals[0].Bacon = true;
        } else {
          meals[0].Bacon = false;
        }
      }

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
