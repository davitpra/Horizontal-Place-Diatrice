export async function changeComplete({ documentId, options, complete = undefined }) {
  try {
    const response = await fetch("/api/strapi", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documentId, options, complete }),
    });

    // Intentar parsear response JSON para dar mensajes útiles
    let body = null;
    try {
      body = await response.json();
    } catch (e) {
      body = null;
    }

    if (!response.ok) {
      let errMsg = `HTTP ${response.status}`;
      if (body) {
        if (body.error) errMsg = typeof body.error === 'string' ? body.error : JSON.stringify(body.error);
        else if (body.message) errMsg = typeof body.message === 'string' ? body.message : JSON.stringify(body.message);
        else errMsg = JSON.stringify(body);
      }
      throw new Error(errMsg);
    }

    return body;
  } catch (error) {
    console.error("Error in changeComplete:", error);
    throw error;
  }
}