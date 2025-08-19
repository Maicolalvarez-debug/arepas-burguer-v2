
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/admin')) {
    const cookie = request.cookies.get('ab_admin')?.value;
    if (!cookie || cookie !== 'ok') {
      const url = new URL('/admin-login', request.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

// Only match /admin and its subpaths, not /api
export const config = {
  matcher: ['/admin/:path*'],
};
