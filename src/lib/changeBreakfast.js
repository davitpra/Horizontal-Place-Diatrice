export async function changeBreakfast({ documentId, options }) {

  console.log("options", options);
  try {
    const response = await fetch("/api/strapi", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documentId, options }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update breakfast");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in changeBreakfast:", error);
    throw error;
  }
}