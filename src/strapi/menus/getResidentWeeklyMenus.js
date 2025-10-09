import { query } from "../strapi";
import { date } from "@/constants/date";
import { getMonday, getSunday } from "@/utils/date";


export async function getResidentWeeklyMenus(documentId) {
  const startDate = getMonday(date);
  const endDate = getSunday(date);
  return query(
    `menus?filters[resident][documentId][$eq]=${documentId}&filters[Date][$gte]=${startDate}&filters[Date][$lte]=${endDate}&sort=Date:asc&populate[breakfast][fields][0]=feature&populate[lunch][fields][0]=soup&populate[lunch][fields][1]=salad&populate[lunch][fields][2]=option_1&populate[lunch][fields][3]=option_2&populate[lunch][fields][4]=dessert&populate[supper][fields][0]=option_1&populate[supper][fields][1]=option_2&populate[supper][fields][3]=side_1&populate[supper][fields][4]=side_2&populate[supper][fields][5]=side_3&populate[supper][fields][6]=side_4&populate[supper][fields][2]=dessert`
  )
    .then((res) => {
      const menus = res.data;
      if (!menus || menus.length === 0) {
        console.warn("No menus found for the given criteria");
        return [];
      }
      
      return menus;
    })
    .catch((error) => {
      console.error("Error fetching resident weekly menus:", error);
      console.error("Error details:", error.response?.data || error.message);
      throw error;
    });
}
