import { query } from "../strapi";


// Mapa de endpoints para cada condición
const ENDPOINT_MAP = {
  breakfast: 'breakfasts',
  lunch: 'lunches',
  supper: 'dinners',
};

export async function changeTray({ documentId, onTray, condition }) {
  // Early return si no hay documentId
  if (!documentId) {
    throw new Error("Missing required field: documentId");
  }

  // Early return si la condición no es válida
  if (!(condition in ENDPOINT_MAP)) {
    throw new Error("Invalid condition. Must be 'breakfast', 'lunch', or 'supper'.");
  }

  try {
    // Construimos el body basado en la condición
    const data = condition === 'breakfast'
      ? { Breakfast: { onTray } }
      : { onTray };

    const endpoint = `${ENDPOINT_MAP[condition]}/${documentId}`;
    const body = { data };

    const response = await query(endpoint, "PUT", body);
    console.log(`${condition} updated:`, response);
    return response;
  } catch (error) {
    console.error(`Error updating ${condition}:`, error);
    throw error;
  }
}
