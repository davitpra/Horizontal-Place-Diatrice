import { NextResponse } from 'next/server';

// This is a placeholder for NextAuth.js integration
// For now, we'll use our custom Strapi authentication
// This endpoint can be used for future NextAuth.js integration

export async function GET(request) {
  return NextResponse.json({ 
    message: 'Strapi authentication is used instead of NextAuth.js',
    status: 'ok' 
  });
}

export async function POST(request) {
  return NextResponse.json({ 
    message: 'Strapi authentication is used instead of NextAuth.js',
    status: 'ok' 
  });
}
