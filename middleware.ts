// middleware.js (in your root directory)
import { NextResponse } from 'next/server';

export function middleware(request : any) {
  const token = request.cookies.get('token')?.value;
  const protectedPaths = ['/DashBoard', '/profile', '/settings'];
  const path = request.nextUrl.pathname;
  const isProtectedPath = protectedPaths.some((pp) => path.startsWith(pp));
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/DashBoard/:path*', '/profile/:path*', '/settings/:path*'],
};