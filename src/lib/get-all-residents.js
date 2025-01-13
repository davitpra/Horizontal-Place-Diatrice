import { query } from "./strapi";

export async function getAllResidents() {
  return query(
    "residents?populate[Breakfast_preferences][populate]=*&populate[Lunch_preferences][populate]=*&populate[Supper_preferences][populate]=*&populate=Picture"
  ).then((res) => {
    return res.data.map((resident) => {
      const {
        id,
        full_name,
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
              value !== undefined && value !== null && value !== "" && value !== false
          )
        );
      }

      // Array of meals preferences with the valid properties
      const meals = [
        filterValidProperties({
          water: Breakfast_preferences?.Breakfast_drink_preference?.water,
          hotdrink: Breakfast_preferences?.Breakfast_drink_preference?.Hotdrink,
          cereals: Breakfast_preferences?.Cereals,
          juice: Breakfast_preferences?.Breakfast_drink_preference?.Juice,
          Milk: Breakfast_preferences?.Breakfast_drink_preference?.Milk,
          eggs: Breakfast_preferences?.eggs,
          toast: Breakfast_preferences?.toast,
          FruitPlate: Breakfast_preferences?.Fruit_plate,
          Yogurt: Breakfast_preferences?.Yogurt,
          Muffing: Breakfast_preferences?.Muffing,
          onTray: Breakfast_preferences?.onTray,
          additionals: Breakfast_preferences?.additionals,
          observation: getComentariesText(Breakfast_preferences),
        }),
        filterValidProperties({
          water: Lunch_preferences?.Lunch_drink_preference?.water,
          hotdrink: Lunch_preferences?.Lunch_drink_preference?.Hotdrink,
          juice: Lunch_preferences?.Lunch_drink_preference?.Juice,
          Milk: Lunch_preferences?.Lunch_drink_preference?.Milk,
          observation: getComentariesText(Lunch_preferences),
        }),
        filterValidProperties({
          water: Supper_preferences?.Lunch_drink_preference?.water,
          hotdrink: Supper_preferences?.Lunch_drink_preference?.Hotdrink,
          juice: Supper_preferences?.Lunch_drink_preference?.Juice,
          Milk: Supper_preferences?.Lunch_drink_preference?.Milk,
          observation: getComentariesText(Supper_preferences),
        }),
      ];

      // if it is Tuesday or Thursday, add pancakes to breakfast
      if (dayOfWeek === 2 || dayOfWeek === 4) {
        if (Breakfast_preferences?.Pancake) {
          meals[0].Pancakes = ' Add pancakes';
        } else {
          meals[0].Pancakes = ' No pancakes';
        }
      }

      // if it is Sunday or Wednesday, add bacon to breakfast
      if (dayOfWeek === 0 || dayOfWeek === 3) {
        if (Breakfast_preferences?.Bacon) {
          meals[0].Bacon = ' Add Bacon';
        } else {
          meals[0].Bacon = ' No Bacon';
        }
      }

      return {
        id,
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
