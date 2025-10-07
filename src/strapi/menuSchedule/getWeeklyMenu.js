import { date } from "@/constants/date";
import { query } from "../strapi";
import { getMonday, getSunday } from "@/utils/date";


export const getWeeklyMenu = async () => {
    const from = getMonday(date);
    const to = getSunday(date);
    return query(`menu-schedules?filters[Date][$gte]=${from}&filters[Date][$lte]=${to}&sort=Date:asc&populate=*`).then((res) => {
        return res.data;
    });
};