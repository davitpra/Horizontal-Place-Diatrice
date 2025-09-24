import { query } from "../strapi";

const ENDPOINT_MAP = {
  breakfast: "breakfasts",
  lunch: "lunches",
  supper: "dinners",
};

export const changeOut = async ({ documentId, went_out_to_eat, complete,condition }) => {

  if (!documentId) {
    throw new Error("Missing required field: documentId");
  }

  if (!(condition in ENDPOINT_MAP)) {
    throw new Error("Invalid condition. Must be 'breakfast', 'lunch', or 'supper'.");
  }

  try {
    const data = { went_out_to_eat, complete };
    const endpoint = `${ENDPOINT_MAP[condition]}/${documentId}`;
    const body = { data };
    const response = await query(endpoint, "PUT", body);
    console.log(`${condition} updated:`, response);
    return response;
  } catch (error) {
    console.error(`Error updating ${condition}:`, error);
    throw error;
  }
};