const {NEXT_PUBLIC_STRAPI_HOST, STRAPI_TOKEN} = process.env;

export function query (url) {
    return fetch(`${NEXT_PUBLIC_STRAPI_HOST}/api/${url}`, {
        headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`
        }
    }).then(res => res.json());
}