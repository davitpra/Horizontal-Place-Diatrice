import { query } from "./strapi";

export async function getAllResidents() {
  return query(
    "residents?populate[Breakfast_preferences][populate]=*&populate[Lunch_preferences][populate]=*&populate[Supper_preferences][populate]=*&populate=Picture"
  ).then((res) => {
    const residents = res.data.map((resident) => {
      const {
        Breakfast_preferences,
        ...rest
      } = resident;

      // 1. Quita la propiedad 'id' de Breakfast_preferences.
      const {
        id: _omitBreakfastId,
        Breakfast_drink_preference,
        ...cleanBreakfastPreferences
      } = Breakfast_preferences || {};

      // 2. Quita la propiedad 'id' de Breakfast_drink_preference.
      const { id: _omitDrinkId, ...cleanBreakfastDrinkPreference } =
        Breakfast_drink_preference || {};

      // Reemplaza el objeto anidado por su versión sin 'id'.
      cleanBreakfastPreferences.Breakfast_drink_preference =
        cleanBreakfastDrinkPreference;

      return {
        Breakfast_preferences: cleanBreakfastPreferences,
        ...rest,
      };
    });

    return residents
  });
}
