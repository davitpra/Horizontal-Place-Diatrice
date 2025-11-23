import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (!path) {
    return new NextResponse('Missing path parameter', { status: 400 });
  }

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_HOST || 'http://localhost:1337';
  let imageUrl;

  if (path.startsWith('http')) {
    imageUrl = path;
  } else {
    imageUrl = `${strapiUrl}${path}`;
  }


  const headers = {};
  // Only send auth token if it's a relative path (internal Strapi) or explicitly the Strapi API
  if (!path.startsWith('http')) {
    headers['Authorization'] = `Bearer ${process.env.STRAPI_API_TOKEN}`;
  }

  try {
    const response = await fetch(imageUrl, {
      headers,
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch image: ${response.statusText}`, { status: response.status });
    }

    const contentType = response.headers.get('content-type');
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
