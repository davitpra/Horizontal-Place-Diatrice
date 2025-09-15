import { query } from "../strapi";

export async function getAllResidents() {
  return query(
    "residents?populate[Breakfast_preferences][populate]=*&populate[Lunch_preferences][populate]=*&populate[Supper_preferences][populate]=*&populate=Picture"
  ).then((res) => {
    const residents = res.data.filter((person) => person.move_out !== true)
    return residents
  });
}
