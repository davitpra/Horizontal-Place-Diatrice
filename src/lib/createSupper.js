import { query } from "./strapi";

export async function createSupper({date, table, full_name, documentId, supper_preferences}) {
  //if lunch_preferences is not provided, use default values
  const preferences = supper_preferences ?? {
        went_out_to_eat: false,
        onTray: false,
        additionals: '',
        Comment: ''
      };
    
  const {went_out_to_eat, onTray, water, Hotdrink, Juice, Milk, additionals, Comment} = preferences;

  const slug =full_name.toLowerCase().replace(/\s+/g, '-')

  const body ={
  "data":{
      "Title": `${full_name}-${date}`,
      "table": table,
      "slug": `${slug}-${date}`,
      "Date": `${date}`,
      "complete": false,
      "went_out_to_eat": went_out_to_eat,
      "onTray": onTray,
      "water": water,
      "Hotdrink": Hotdrink,
      "Juice": Juice,
      "Milk": Milk,
      "additionals": additionals,
      "Comment": Comment,
      "menu": documentId,
  }}

  try {
    const response = await query("dinners", 'POST', body);
    console.log("body", body);
    console.log("supper created:", response);
    return response;
  } catch (error) {
    console.error("Error creating supper:", error);
    throw error;
  }
}
