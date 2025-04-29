export default async function handler(req, res) {
    if (req.method !== "PUT") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { documentId, options } = req.body;
  
    if (!documentId || !options) {
      return res.status(400).json({ error: "Missing required fields: documentId or options" });
    }
  
    const { NEXT_PUBLIC_STRAPI_HOST, STRAPI_TOKEN } = process.env;
  
    try {
      const response = await fetch(`${NEXT_PUBLIC_STRAPI_HOST}/api/breakfasts/${documentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            Breakfast: options,
          },
        }),
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