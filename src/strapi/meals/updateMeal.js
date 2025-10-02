import { query } from "../strapi";

// Update a specific meal entry in Strapi (breakfast, lunch, supper)
export const updateMeal = async ({
  condition,
  documentId,
  options,
}) => {
  if (!documentId) {
    throw new Error("Missing required field: documentId");
  }

  if (!condition || !["breakfast", "lunch", "supper"].includes(condition)) {
    throw new Error(
      "Invalid condition. Must be 'breakfast', 'lunch', or 'supper'."
    );
  }

  const endpointMap = {
    breakfast: (id) => `breakfasts/${id}`,
    lunch: (id) => `lunches/${id}`,
    supper: (id) => `dinners/${id}`,
  };

  // option should be a boolean when the change in menu is done.
  const body = {
    data: {
      ...options,
    },
  };

  const endpoint = endpointMap[condition](documentId);

  try {
    const response = await query(endpoint, "PUT", body);
    return response;
  } catch (error) {
    console.error(`Error updating ${condition}:`, error);
    throw error;
  }
};



