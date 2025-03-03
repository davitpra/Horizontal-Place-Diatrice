import { query } from "./strapi";

export async function getDayBasicInfo(meal,date) {
  return query(
    `${meal}?filters[Date][$eq]=${date}`
  )
}