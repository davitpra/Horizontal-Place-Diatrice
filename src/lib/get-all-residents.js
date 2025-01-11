import { query } from "./strapi";

export async function getAllResidents() {
  return query(
    "residents?populate=Picture&populate=Breakfast_preferences&populate=Lunch_preferences&populate=Supper_preferences"
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
        Drink_preference,
        breakfast_preference,
      } = resident;

      const meals = [
        {
          water: Drink_preference?.water || "",
          hotdrink: Drink_preference?.Hotdrink || "",
          cereals: breakfast_preference?.Cereals || "",
          juice: Drink_preference?.Juice || "",
          eggs: breakfast_preference?.eggs || "",
          toast: breakfast_preference?.toast || "",
          observation: breakfast_preference?.Comentaries || ""
        },
        {
          water: Drink_preference?.water || "",
          hotdrink: Drink_preference?.Hotdrink || "",
          juice: Drink_preference?.Juice || "",
        },
        {
          water: Drink_preference?.water || "",
          hotdrink: Drink_preference?.Hotdrink || "",
          juice: Drink_preference?.Juice || "",
        }
      ];

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
