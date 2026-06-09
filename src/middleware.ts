import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const publicRoutes = ['/', '/api/auth/login', '/api/auth/register', '/api/auth/forgot-password', '/api/auth/reset-password', '/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static files and internal Next.js paths are public
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/logo') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.some(route => 
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  );
  const sessionCookie = request.cookies.get('session');

  // Verify session
  let isValidSession = false;
  let role = null;

  if (sessionCookie) {
    try {
      const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET || '');
      const { payload } = await jwtVerify(sessionCookie.value, encodedKey, {
        algorithms: ['HS256'],
      });
      isValidSession = true;
      role = payload.role;
    } catch (error) {
      isValidSession = false;
    }
  }

  // Redirect logic
  if (!isValidSession && !isPublicRoute) {
    // Unauthenticated user trying to access a protected route
    const url = new URL('/auth', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  if (isValidSession && (pathname === '/' || pathname === '/auth')) {
    // Authenticated user on landing or auth page -> redirect to their home
    const redirectUrl = role === 'project_manager' ? '/dashboard' : '/projects';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
