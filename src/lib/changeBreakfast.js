import { query } from "./strapi";


export async function changeBreakfast({documentId, options =[]}) {

  const body ={
  "data":{
      "Breakfast": {
        "Cereals": "Rice Crispy"
      },
  }}

  try {
    const response = await query(`breakfasts/${documentId}`, 'POST', body);
    return response;
  } catch (error) {
    console.error("Error creating breakfast:", error);
    throw error;
  }
}
