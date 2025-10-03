import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Rutas que requieren autenticación
const protectedRoutes = [
  '/dashboard',
  '/room',
  '/summary',
  '/table',
  '/trays'
];

// Rutas de autenticación (redirigir si ya está autenticado)
const authRoutes = [
  '/login',
  '/register'
];

// Rutas públicas
const publicRoutes = [
  '/',
  '/api'
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Verificar si es una ruta protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Verificar si es una ruta de autenticación
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Verificar si es una ruta pública
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Obtener el token de las cookies
  const token = request.cookies.get('jwt')?.value;

  // Si es una ruta protegida y no hay token, redirigir al login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si es una ruta de autenticación y hay token, redirigir al dashboard
  if (isAuthRoute && token) {
    try {
      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      // Token inválido, continuar normalmente
      console.log('Invalid token:', error.message);
    }
  }

  // Si hay token, verificar que sea válido
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Agregar información del usuario a los headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.id?.toString() || '');
      requestHeaders.set('x-user-email', decoded.email || '');
      requestHeaders.set('x-user-username', decoded.username || '');
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Token inválido, limpiar cookie y continuar
      console.log('Invalid token:', error.message);
      
      if (isProtectedRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('jwt');
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
