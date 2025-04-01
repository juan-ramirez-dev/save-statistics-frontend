import { NextRequest, NextResponse } from 'next/server';

// This function runs at the edge, not on the client or server
export async function middleware(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;
  
  // Path being accessed
  const { pathname } = request.nextUrl;

  // Check if path is dashboard and needs protection
  if (pathname.startsWith('/dashboard')) {
    // If no token, redirect to signin
    if (!token) {
      const url = new URL('/signin', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }

    // Token exists, we assume it's valid at this level
    // JWT validation will happen at the API level when making requests
    // This is a simple check to prevent users without tokens from accessing protected routes
    return NextResponse.next();
  }

  // For other routes, don't apply middleware
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: ['/dashboard/:path*']
}; 