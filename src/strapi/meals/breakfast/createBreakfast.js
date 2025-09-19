import { query } from "../../strapi";


export async function createBreakfast({date, table, full_name, documentId, breakFast}) {

  const preferences = breakFast ?? {
    went_out_to_eat: false,
    onTray: false,
    additionals: '',
    Comment: ''
  }

  const {went_out_to_eat, onTray, additionals, Comment, water, Hotdrink, Cereals, Juice, Milk, eggs, toast, FruitPlate, Yogurt, Muffing, Pancakes, Bacon} = preferences;

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
      "additionals": additionals,
      "Comment": Comment,
      "water": water,
      "Hotdrink": Hotdrink,
      "Juice": Juice,
      "Milk": Milk,
      "Cereals": Cereals,
      "eggs": eggs,
      "toast": toast,
      "FruitPlate": FruitPlate,
      "Yogurt": Yogurt,
      "Muffing": Muffing,
      "Pancakes": Pancakes,
      "Bacon": Bacon,
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
