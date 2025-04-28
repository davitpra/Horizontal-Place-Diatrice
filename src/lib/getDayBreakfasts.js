

import { query } from "./strapi";

export async function getDayBreakfasts(date) {
  return query(
    `breakfasts?filters[Date][$eq]=${date}-16&populate[Breakfast][populate]=*`
  )  
  .then((res) => {
    return res.data.map((breakFast) => {
    const { Breakfast, complete, went_out_to_eat, slug, documentId} = breakFast;

      //GET DAY OF WEEK
      let today = new Date();
      let dayOfWeek = today.getDay();

      // Helper function to get the text from the comentaries
      function getComentariesText(meal_preferences) {
        const comentaries = meal_preferences?.Comentaries || [];
        const texts = [];
        comentaries.forEach((comentary) => {
          comentary.children.forEach((child) => {
            texts.push(child.text);
          });
        });

        return texts;
      }

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
          Water: Breakfast?.Breakfast_drink_preference?.water,
          Hotdrink: Breakfast?.Breakfast_drink_preference?.Hotdrink,
          Cereals: Breakfast?.Cereals,
          Juice: Breakfast?.Breakfast_drink_preference?.Juice,
          Milk: Breakfast?.Breakfast_drink_preference?.Milk,
          Eggs: Breakfast?.eggs,
          Toast: Breakfast?.toast,
          FruitPlate: Breakfast?.Fruit_plate ? "Add" : "none",
          Yogurt: Breakfast?.Yogurt ? "Add" : "none",
          Muffing: Breakfast?.Muffing ? "Add" : "none",
          onTray: Breakfast?.onTray,
          Additionals: Breakfast?.additionals,
          Observation: getComentariesText(Breakfast),
        }),
        // filterValidProperties({
        //   Water: Lunch_preferences?.Lunch_drink_preference?.water,
        //   Hotdrink: Lunch_preferences?.Lunch_drink_preference?.Hotdrink,
        //   Juice: Lunch_preferences?.Lunch_drink_preference?.Juice,
        //   Milk: Lunch_preferences?.Lunch_drink_preference?.Milk,
        //   onTray: Lunch_preferences?.onTray,
        //   Additionals: Lunch_preferences?.additionals,
        //   Observation: getComentariesText(Lunch_preferences),
        // }),
        // filterValidProperties({
        //   Water: Supper_preferences?.Lunch_drink_preference?.water,
        //   Hotdrink: Supper_preferences?.Lunch_drink_preference?.Hotdrink,
        //   Juice: Supper_preferences?.Lunch_drink_preference?.Juice,
        //   Milk: Supper_preferences?.Lunch_drink_preference?.Milk,
        //   onTray: Supper_preferences?.onTray,
        //   Additionals: Supper_preferences?.additionals,
        //   Observation: getComentariesText(Supper_preferences),
        // }),
      ];

      // if it is Thursday, add pancakes to breakfast
      if (dayOfWeek === 4) {
        if (Breakfast?.Pancake) {
          meals[0].Pancakes = "Add";
        } else {
          meals[0].Pancakes = "none";
        }
      }

      // if it is Sunday or Wednesday, add bacon to breakfast
      if (dayOfWeek === 0 || dayOfWeek === 3) {
        if (Breakfast?.Bacon) {
          meals[0].Bacon = "Add";
        } else {
          meals[0].Bacon = "none";
        }
      }

      const onTray = Breakfast?.onTray;

    return {
      documentId,
      complete,
      went_out_to_eat,
      meals,
      onTray,
      slug
    };
  })});
}