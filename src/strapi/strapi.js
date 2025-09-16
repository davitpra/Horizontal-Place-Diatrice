// Get the base URL for API requests
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser should use relative path
    return '';
  }
  if (process.env.VERCEL_URL) {
    // Reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    // Reference for deployment
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // Assume localhost
  return `http://localhost:${process.env.PORT || 3000}`;
};

export async function query(endpoint, method = 'GET', data = null) {
  try {
    const baseUrl = getBaseUrl();
    const apiUrl = `${baseUrl}/api/strapi`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint,
        method,
        data
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Strapi API error:', error);
    throw error;
  }
}