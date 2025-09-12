const BREAKFAST = [
  { key: "water", options: ["none", "with ice", "no ice"] },
  { key: "Hotdrink", options: ["none", "Coffee", "Tea"] },
  {
    key: "Cereals",
    options: ["none", "Bran Flakes", "Corn Flakes", "Rice Crispy", "Oatmeal"],
  },
  { key: "Juice", options: ["none", "Tomato", "Orange", "Cramberry", "Apple"] },
  { key: "Milk", options: ["none", "regular", "lactose free"] },
  {
    key: "eggs",
    options: ["none", "over easy", "scramble", "pouched", "boiled"],
  },
  { key: "toast", options: ["none", "brown", "white", "raisen", "rye"] },
  { key: "FruitPlate", options: ["none", "Add"] },
  { key: "Yogurt", options: ["none", "Add"] },
  { key: "Muffing", options: ["none", "Add"] },
  { key: "additionals", options: [""] },
  { key: "Comment", options: [""] },
];
//GET DAY OF WEEK
let today = new Date();
const dayOfWeek = today.getDay();

// if it is Thursday, add pancakes to breakfast
if (dayOfWeek === 4) {
  BREAKFAST.push({ key: "Pancakes", options: ["none", "Add"] });
}

// if it is Sunday or Wednesday, add bacon to breakfast
if (dayOfWeek === 0 || dayOfWeek === 3) {
  BREAKFAST.push({ key: "Bacon", options: ["none", "Add"] });
}

const LUNCH = [
  { key: "water", options: ["none", "with ice", "no ice"] },
  { key: "Hotdrink", options: ["none", "Coffee", "Tea"] },
  { key: "Juice", options: ["none", "Tomato", "Orange", "Cramberry", "Apple"] },
  { key: "Milk", options: ["none", "regular", "lactose free"] },
  { key: "additionals", options: [""] },
  { key: "Comment", options: [""] },
  { key: "soup", options: ["none", "Add"] },
  { key: "salad", options: ["none", "Add"] },
  { key: "option_1", options: ["none", "Add"] },
  { key: "option_2", options: ["none", "Add"] },
  { key: "dessert", options: ["Ice Cream", "Peaches", "Rice Pudding", "Jelly"] },
];

const SUPPER = [
  { key: "water", options: ["none", "with ice", "no ice"] },
  { key: "Hotdrink", options: ["none", "Coffee", "Tea"] },
  { key: "Juice", options: ["none", "Tomato", "Orange", "Cramberry", "Apple"] },
  { key: "Milk", options: ["none", "regular", "lactose free"] },
  { key: "additionals", options: [""] },
  { key: "Comment", options: [""] },
  { key: "option_1", options: ["none", "Add"] },
  { key: "option_2", options: ["none", "Add"] },
  { key: "side_1", options: ["none", "Add"] },
  { key: "side_2", options: ["none", "Add"] },
  { key: "side_3", options: ["none", "Add"] },
  { key: "side_4", options: ["none", "Add"] },
  { key: "dessert", options: ["Ice Cream", "Peaches", "Rice Pudding", "Jelly"] },
];

export const MEAL_OPTIONS = [BREAKFAST, LUNCH, SUPPER];
