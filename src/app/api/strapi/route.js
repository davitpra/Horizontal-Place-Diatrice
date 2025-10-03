import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const STRAPI_HOST = process.env.STRAPI_HOST;

export async function POST(request) {
  try {
    const body = await request.json();
    const { endpoint, method, data } = body;

    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwt')?.value;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Add authorization header if authentication is required and token is available
    if (jwtToken) {
      options.headers.Authorization = `Bearer ${jwtToken}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${STRAPI_HOST}/api/${endpoint}`, options);
    const result = await response.json();

    // Handle authentication errors
    if (response.status === 401) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in', valid: false },
        { status: 401 }
      );
    }

    if (response.status === 403) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Strapi API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
