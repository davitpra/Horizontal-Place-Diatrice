import { query } from "./strapi";

export async function getMenuSchedule(date) {
  return query(
    `menu-schedules?filters[Date][$eq]=${date}&populate=*`
  ).then((res) => {
    console.log("res", res);
  });
}
