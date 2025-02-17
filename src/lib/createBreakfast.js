import { query } from "./strapi";


export async function createBreakfast({date, full_name, documentId=null, breakFast}) {

  const slug =full_name.toLowerCase().replace(/\s+/g, '-')

  const body ={
  "data":{
      "title": `${full_name}-${date}`,
      "slug": `${slug}-${date}`,
      "Date": `${date}`,
      "complete": false,
      "went_out_to_eat": false,
      "Breakfast": breakFast,
  }}

  if (documentId) {
    body.data.menu = `${documentId}`;
  }

  try {
    const response = await query("breakfasts", 'POST', body);
    return response;
  } catch (error) {
    console.error("Error creating breakfast:", error);
    throw error;
  }
}
