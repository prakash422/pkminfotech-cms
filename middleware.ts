import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE = "next-auth.admin.session-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow requests to login page and public files
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Protect /admin routes with ADMIN session only (separate from user auth)
  if (pathname.startsWith("/admin")) {
    const adminToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: ADMIN_SESSION_COOKIE,
    });
    if (!adminToken) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    if (adminToken.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
