import { query } from "./strapi";


export async function createBreakfast({date, table, full_name, documentId, breakFast}) {

  const slug =full_name.toLowerCase().replace(/\s+/g, '-')

  const body ={
  "data":{
      "title": `${full_name}-${date}`,
      "table": table,
      "slug": `${slug}-${date}`,
      "Date": `${date}`,
      "complete": false,
      "Breakfast": breakFast,
      "menu": documentId,
  }}

  try {
    const response = await query("breakfasts", 'POST', body);
    console.log("body", body);
    console.log("Breakfast created:", response);
    return response;
  } catch (error) {
    console.error("Error creating breakfast:", error);
    throw error;
  }
}
