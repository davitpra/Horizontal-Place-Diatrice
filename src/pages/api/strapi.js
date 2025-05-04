export default async function handler(req, res) {
    if (req.method !== "PUT") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { documentId, options, complete} = req.body;
  
    if (!documentId) {
      return res.status(400).json({ error: "Missing required field: documentId" });
    }
  
    const { NEXT_PUBLIC_STRAPI_HOST, STRAPI_TOKEN } = process.env;
  
    try {
      const requestBody = {
        data: {
          ...(options && { Breakfast: options }), // Incluir `Breakfast` solo si `options` está definido
          ...(complete !== undefined && { complete }), // Incluir `complete` solo si está definido
        },
      };
      const response = await fetch(`${NEXT_PUBLIC_STRAPI_HOST}/api/breakfasts/${documentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({ error: errorData });
      }
  
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error updating breakfast:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }