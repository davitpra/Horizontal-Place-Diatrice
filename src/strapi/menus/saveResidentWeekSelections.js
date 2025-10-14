import { query } from "../strapi";
import { createMenus } from "./createMenus";
import { updateMeal } from "../meals/updateMeal";
import { createBreakfast } from "../meals/breakfast/createBreakfast";
import { createLunch } from "../meals/lunch/createLunch";
import { createSupper } from "../meals/supper/createSupper";

const buildDateToSchedule = (scheduleArray) => {
  return scheduleArray.reduce((acc, item) => {
    acc[item.Date] = item;
    return acc;
  }, {});
};

export async function saveResidentWeekSelections({ selections, schedule, selectedResident }) {
  if (!selections || !schedule || !selectedResident) {
    throw new Error("Missing required parameters for saveResidentWeekSelections");
  }

  const {
    documentId,
    full_name,
    table,
    Seating,
    Breakfast_preferences,
    Lunch_preferences,
    Supper_preferences,
  } = selectedResident ?? {};

  if (!documentId || !full_name || !Seating) {
    throw new Error("Selected resident is missing required fields (documentId, full_name, Seating)");
  }

  const dateToSchedule = buildDateToSchedule(schedule);

  // Persist per-date changes
  for (const [dateStr, meals] of Object.entries(selections)) {
    // 1) find existing resident menu for date (populate to get meal IDs)
    const existing = await query(
      `menus?filters[resident][documentId][$eq]=${documentId}&filters[Date][$eq]=${dateStr}&pagination[pageSize]=1&populate=*`
    );
    let menuId = existing?.data?.[0]?.documentId;

    // 2) if not exists, create base menu
    if (!menuId) {
      const created = await createMenus({ date: dateStr, full_name: full_name, documentId, Seating: Seating });
      menuId = created?.data?.documentId 

      // Create base meals for the new menu
      await Promise.all([
        createBreakfast({ date: dateStr, table: table, full_name: full_name, documentId: menuId, breakFast: Breakfast_preferences }),
        createLunch({ date: dateStr, table: table, full_name: full_name, documentId: menuId, lunch_preferences: Lunch_preferences }),
        createSupper({ date: dateStr, table: table, full_name: full_name, documentId: menuId, supper_preferences: Supper_preferences }),
      ]);
    }

    // 2.1) fetch populated menu by id to reliably get meal relation IDs
    const populatedRes = await query(`menus/${menuId}?populate=*`);
    const populatedMenu = populatedRes?.data || populatedRes;
    console.log("populatedMenu", populatedMenu);

    // Try both flattened and Strapi default shapes
    const breakfastId = populatedMenu?.breakfast?.documentId
    const lunchId = populatedMenu?.lunch?.documentId
    const supperId = populatedMenu?.supper?.documentId

    // 3) build update payload using schedule text for selected fields
    const data = {};

    for (const [mealKey, fieldsObj] of Object.entries(meals)) {
      const payloadForMeal = {};

      for (const [field, isSelected] of Object.entries(fieldsObj)) {
        if (typeof isSelected !== "undefined") {
          payloadForMeal[field] = !!isSelected; // true o false según el UI
        }
      }

      if (Object.keys(payloadForMeal).length > 0) {
        if (mealKey === "breakfast") data.breakfast = payloadForMeal;
        if (mealKey === "lunch") data.lunch = payloadForMeal;
        if (mealKey === "supper") data.supper = payloadForMeal;
      }
    }

    // 4) Update each meal entry directly via updateMeal when IDs exist
    if (data.breakfast && breakfastId) {
      await updateMeal({ condition: "breakfast", documentId: breakfastId, options: data.breakfast });
    }
    if (data.lunch && lunchId) {
      await updateMeal({ condition: "lunch", documentId: lunchId, options: data.lunch });
    }
    if (data.supper && supperId) {
      await updateMeal({ condition: "supper", documentId: supperId, options: data.supper });
    }
  }

  return { ok: true };
}


