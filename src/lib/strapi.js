const { NEXT_PUBLIC_STRAPI_HOST, STRAPI_TOKEN } = process.env;

export function query(url, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(`${NEXT_PUBLIC_STRAPI_HOST}/api/${url}`, options).then(res => res.json());
}