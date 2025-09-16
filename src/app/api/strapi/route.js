import { NextResponse } from 'next/server';

const STRAPI_HOST = process.env.STRAPI_HOST;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

export async function POST(request) {
  try {
    const body = await request.json();
    const { endpoint, method, data } = body;

    const options = {
      method,
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${STRAPI_HOST}/api/${endpoint}`, options);
    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Strapi API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
