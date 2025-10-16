import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/projects', req.url));
  }
}

export const config = {
  matcher: ['/projects/:path*', '/login'],
};
