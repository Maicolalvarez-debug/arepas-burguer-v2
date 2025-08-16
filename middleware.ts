import { NextRequest, NextResponse } from "next/server";
const PROTECTED_PREFIX = "/admin";
const PUBLIC_PATHS = ["/admin/login"];
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith(PROTECTED_PREFIX) && !PUBLIC_PATHS.includes(pathname)) {
    const cookie = req.cookies.get("ab_admin");
    if (!cookie || cookie.value !== "1") {
      const url = req.nextUrl.clone(); url.pathname = "/admin/login"; return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*"] };
