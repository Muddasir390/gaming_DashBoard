// middleware.js (in your root directory)
import { NextResponse } from 'next/server';

export function middleware(request : any) {
  const token = request.cookies.get('token')?.value;
  const protectedPaths = ['/DashBoard', '/profile', '/settings', '/users', '/specificUserDetail', '/posts', '/fleetMangement', '/userDetail'];
  const path = request.nextUrl.pathname;
  const isProtectedPath = protectedPaths.some((pp) => path.startsWith(pp));
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/DashBoard/:path*', '/profile/:path*', '/settings/:path*', '/users/:path*',  '/specificUserDetail/:path*', '/posts/:path*', '/fleetMangement/:path*', '/userDetail/:path*', '/acquisition/:path*'],
};