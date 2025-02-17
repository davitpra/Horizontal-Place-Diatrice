import { query } from "./strapi";


export async function createMenus({date, full_name, documentId=null}) {

  const slug =full_name.toLowerCase().replace(/\s+/g, '-')

  const body ={
  "data":{
      "Date": `${date}`,
      "Title": `${full_name}-${date}`,
      "slug": `${slug}-${date}`,
      }
  }

  if (documentId) {
    body.data.resident = `${documentId}`;
  }

  try {
    const response = await query("menus", 'POST', body);
    console.log("Response from createMenus", response);
    return response;
  } catch (error) {
    console.error("Error creating menu:", error);
    throw error;
  }
}
