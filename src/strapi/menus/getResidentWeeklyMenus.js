import { query } from "../strapi";
import { date } from "@/constants/date";
import { getMonday, getSunday } from "@/utils/date";


export async function getResidentWeeklyMenus(documentId) {
    const startDate = getMonday(date);
    console.log("------> startDate", startDate);
    const endDate = getSunday(date);
    console.log("------> endDate", endDate);
    console.log("------> documentId", documentId);
  return query(
    `menus?filters[resident][documentId][$eq]=${documentId}`
  )    
  .then((res) => {
    const menus = res.data
    console.log("------> query response data:", res.data);
    return menus
  });;
}
