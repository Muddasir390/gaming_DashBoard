// middleware.js (in your root directory)
import { NextResponse } from 'next/server';

export function middleware(request : any) {
  // Get the user's authentication status from cookies
  const token = request.cookies.get('token')?.value;
  console.log('token(((((', token);
  

  // Define protected paths
  const protectedPaths = ['/dashBoard', '/profile', '/settings'];
  const path = request.nextUrl.pathname;

  // Check if the requested path is protected
  const isProtectedPath = protectedPaths.some((pp) => path.startsWith(pp));

  // If the path is protected and the user is not authenticated, redirect to login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow the request to continue if authenticated or if the route is not protected
  return NextResponse.next();
}

// Configure which paths should be matched by the middleware
export const config = {
  matcher: ['/dashBoard/:path*', '/profile/:path*', '/settings/:path*'],
};