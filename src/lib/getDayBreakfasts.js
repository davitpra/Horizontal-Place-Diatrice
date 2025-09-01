import { query } from "./strapi";

export async function getDayBreakfasts(date) {
  return query(
    `breakfasts?filters[Date][$eq]=${date}&populate[Breakfast][populate]=*`
  ).then((res) => {
    return res.data.map((breakFast) => {
      const { Breakfast, complete, slug, documentId, table} = breakFast;
      const went_out_to_eat = Breakfast?.went_out_to_eat;
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
          water: Breakfast?.water,
          Hotdrink: Breakfast?.Hotdrink,
          Juice: Breakfast?.Juice,
          Cereals: Breakfast?.Cereals,
          Milk: Breakfast?.Milk,
          eggs: Breakfast?.eggs,
          toast: Breakfast?.toast,
          FruitPlate: Breakfast?.FruitPlate,
          Yogurt: Breakfast?.Yogurt,
          Muffing: Breakfast?.Muffing,
          additionals: Breakfast?.additionals,
          Comment: Breakfast?.Comment,
        }),
      ];

      // if it is Thursday, add pancakes to breakfast
      if (dayOfWeek === 4) {
        if (Breakfast?.Pancake) {
          meals[0].Pancake = true;
        } else {
          meals[0].Pancake = false;
        }
      }

      // if it is Sunday or Wednesday, add bacon to breakfast
      if (dayOfWeek === 0 || dayOfWeek === 3) {
        if (Breakfast?.Bacon) {
          meals[0].Bacon = true;
        } else {
          meals[0].Bacon = false;
        }
      }

      const onTray = Breakfast?.onTray;

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
