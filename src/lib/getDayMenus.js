import { query } from "./strapi";

export async function getDayMenus(date) {
  return query(
    `Menus?filters[Date][$eq]=${date}`
  )  
  // .then((menu) => {
  //   const { id, Date,documentId, Breakfast, Lunch, Supper } = menu.data[0];
  //   return {
  //     id,
  //     Date,
  //     documentId,
  //     Breakfast,
  //     Lunch,
  //     Supper,
  //   };
  // });
}
