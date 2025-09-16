import { query } from "../strapi";

export async function changeComplete({
  documentId,
  complete = undefined,
  condition,
}) {
  try {
    // Validar que documentId esté presente
    if (!documentId) {
      throw new Error("Missing required field: documentId");
    }

    const body = {
      data: {
        complete: complete,
      },
    };

    let endpoint = "";
    switch (condition) {
      case "breakfast":
        endpoint = `breakfasts/${documentId}`;
        break;
      case "lunch":
        endpoint = `lunches/${documentId}`;
        break;
      case "supper":
        endpoint = `dinners/${documentId}`;
        break;
      default:
        throw new Error(
          "Invalid condition. Must be 'breakfast', 'lunch', or 'supper'."
        );
    }

    const response = await query(endpoint, "PUT", body);
    console.log(`${condition} updated:`, response);
    return response;
  } catch (error) {
    console.error(`Error updating ${condition}:`, error);
    throw error;
  }
}
