import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect the specific admin/ramana routes (excluding login itself)
  if (pathname.startsWith("/admin/ramana") && pathname !== "/admin/ramana/login") {
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.redirect(new URL("/admin/ramana/login", request.url));
    }

    if (!process.env.JWT_ACCESS_SECRET) {
      console.error("❌ JWT_ACCESS_SECRET is not defined in the frontend environment (root .env).");
      return NextResponse.redirect(new URL("/admin/ramana/login", request.url));
    }

    try {
      // Decode JWT at the edge using jose
      const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
      const { payload } = await jwtVerify(accessToken, secret);

      // Verify the role is admin
      if (payload.role !== "admin") {
        console.warn(`⚠️ Non-admin access attempt (role: ${payload.role})`);
        return NextResponse.redirect(new URL("/admin/ramana/login", request.url));
      }

      return NextResponse.next();
    } catch (err) {
      console.error("❌ JWT validation failed:", err);
      // Token expired or invalid
      return NextResponse.redirect(new URL("/admin/ramana/login", request.url));
    }
  }

  // Handle requests to the old /admin path to avoid 404s/leaks
  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
