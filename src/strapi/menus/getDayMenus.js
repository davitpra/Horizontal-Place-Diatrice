import { query } from "../strapi";

export async function getDayMenus(date) {
  return query(
    `menus?filters[Date][$eq]=${date}&populate[breakfast][fields][0]=documentId&populate[lunch][fields][0]=documentId&populate[supper][fields][0]=documentId&populate[resident][fields][0]=full_name`
  )  
  .then((res) => {
    const menus = res.data
    return menus
  });;
}
