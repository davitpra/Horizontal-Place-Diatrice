import { query } from "../strapi";

export async function getMenuSchedule(date) {
  return query(
    `menu-schedules?filters[Date][$eq]=${date}&populate=*`
  ).then((res) => {
    return [
      { meal: 'breakfastMenu', data: res.data[0].Breakfast },
      { meal: 'lunchMenu', data: res.data[0].Lunch },
      { meal: 'supperMenu', data: res.data[0].Dinner }
    ]
  });
}
