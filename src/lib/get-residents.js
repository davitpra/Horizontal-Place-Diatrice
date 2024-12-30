import { query } from "./strapi";

export async function getResidents() {
  return query("residents").then((res) => {
    console.log(res);
    return res;
  });
}
