export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { documentId, options, onTray, condition } = req.body;


  // Validar condition y determinar el endpoint
  let endpoint = "";
  if (condition === "breakfast") {
    endpoint = condition + "s"; // pluralizar
  } else if (condition === "lunch") {
    endpoint = "lunches";
  } else if (condition === "supper") {
    endpoint = "dinners";
  } else {
    return res
      .status(400)
      .json({
        error: "Invalid condition. Must be 'breakfast', 'lunch', or 'supper'.",
      });
  }
  // Validar que documentId esté presente
  if (!documentId) {
    return res
      .status(400)
      .json({ error: "Missing required field: documentId" });
  }

  const { NEXT_PUBLIC_STRAPI_HOST, STRAPI_TOKEN } = process.env;

  // Construir el cuerpo de la solicitud dinámicamente
  try {
    let requestBody = {};

    // Si condition es "breakfast", usar estructura de "Breakfast" por diseno API
    if (condition !== "breakfast") {
      requestBody = {
        data: {
          ...(options && { options }), // Incluir `options` solo si está definido
          ...(onTray !== undefined && { onTray }), // Incluir `onTray` solo si está definido
        },
      };
    } else {
      // Construir payload de Breakfast poniendo onTray dentro del objeto Breakfast
      let breakfastPayload;
      // Si options es un objeto, clonarlo; si no, usarlo tal cual
      if (options !== undefined) {
        // Si options es un objeto, combinar; si no, lo guardamos como valor bajo una clave genérica
        breakfastPayload = typeof options === 'object' && options !== null ? { ...options } : { value: options };
      }

      if (onTray !== undefined) {
        breakfastPayload = { ...(breakfastPayload || {}), onTray };
      }

      requestBody = {
        data: {
          ...(breakfastPayload !== undefined && { Breakfast: breakfastPayload }),
        },
      };
    }

    console.log("------>Request Body:", requestBody);

    // Realizar la solicitud a Strapi
    const response = await fetch(
      `${NEXT_PUBLIC_STRAPI_HOST}/api/${endpoint}/${documentId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error updating:", error);
    return res.status(500).json({ error: "Internal server error" });

  }
}
