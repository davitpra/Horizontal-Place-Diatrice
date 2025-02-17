import { query } from "./strapi";

export async function getAllResidents() {
  return query(
    "residents?populate[Breakfast_preferences][populate]=*&populate[Lunch_preferences][populate]=*&populate[Supper_preferences][populate]=*&populate=Picture"
  ).then((res) => {
    return res.data.map((resident) => {
      const {
        id,
        documentId,
        full_name,
        slug,
        table,
        priority,
        roomId,
        Seating,
        Service_Notes,
        Dietary_Guidelines,
        Picture,
        Breakfast_preferences,
        Lunch_preferences,
        Supper_preferences,
      } = resident;

      //GET DAY OF WEEK
      let today = new Date();
      const dayOfWeek = today.getDay();

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
              value !== undefined && value !== null && value !== "" && value !== false && value !== "none"
          )
        );
      }

      // Array of meals preferences with the valid properties
      const meals = [
        filterValidProperties({
          Water: Breakfast_preferences?.Breakfast_drink_preference?.water,
          Hotdrink: Breakfast_preferences?.Breakfast_drink_preference?.Hotdrink,
          Cereals: Breakfast_preferences?.Cereals,
          Juice: Breakfast_preferences?.Breakfast_drink_preference?.Juice,
          Milk: Breakfast_preferences?.Breakfast_drink_preference?.Milk,
          Eggs: Breakfast_preferences?.eggs,
          Toast: Breakfast_preferences?.toast,
          FruitPlate: Breakfast_preferences?.Fruit_plate ? "Add" : "none",
          Yogurt: Breakfast_preferences?.Yogurt ? "Add" : "none",
          Muffing: Breakfast_preferences?.Muffing ? "Add" : "none",
          onTray: Breakfast_preferences?.onTray,
          Additionals: Breakfast_preferences?.additionals,
          Observation: getComentariesText(Breakfast_preferences),
        }),
        filterValidProperties({
          Water: Lunch_preferences?.Lunch_drink_preference?.water,
          Hotdrink: Lunch_preferences?.Lunch_drink_preference?.Hotdrink,
          Juice: Lunch_preferences?.Lunch_drink_preference?.Juice,
          Milk: Lunch_preferences?.Lunch_drink_preference?.Milk,
          onTray: Lunch_preferences?.onTray,
          Additionals: Lunch_preferences?.additionals,
          Observation: getComentariesText(Lunch_preferences),
        }),
        filterValidProperties({
          Water: Supper_preferences?.Lunch_drink_preference?.water,
          Hotdrink: Supper_preferences?.Lunch_drink_preference?.Hotdrink,
          Juice: Supper_preferences?.Lunch_drink_preference?.Juice,
          Milk: Supper_preferences?.Lunch_drink_preference?.Milk,
          onTray: Supper_preferences?.onTray,
          Additionals: Supper_preferences?.additionals,
          Observation: getComentariesText(Supper_preferences),
        }),
      ];

      // if it is Thursday, add pancakes to breakfast
      if (dayOfWeek === 4) {
        if (Breakfast_preferences?.Pancake) {
          meals[0].Pancakes = 'Add';
        } else {
          meals[0].Pancakes = 'none';
        }
      }

      // if it is Sunday or Wednesday, add bacon to breakfast
      if (dayOfWeek === 0 || dayOfWeek === 3) {
        if (Breakfast_preferences?.Bacon) {
          meals[0].Bacon = 'Add';
        } else {
          meals[0].Bacon = 'none';
        }
      }

      return {
        id,
        documentId,
        slug,
        full_name,
        table,
        priority,
        roomId,
        Seating,
        meals,
        Picture,
        Service_Notes,
        Dietary_Guidelines,
      };
    });
  });
}
