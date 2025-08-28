import { query } from "./strapi";


export async function createLunch({date, full_name, documentId, lunch_preferences}) {
  //if lunch_preferences is not provided, use default values
  const preferences = lunch_preferences ?? {
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
      "Slug": `${slug}-${date}`,
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
    const response = await query("lunches", 'POST', body);
    console.log("body", body);
    console.log("Lunch created:", response);
    return response;
  } catch (error) {
    console.error("Error creating lunch:", error);
    throw error;
  }
}
