import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me")

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (
    pathname === "/login" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/robots.txt" ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|webp|gif|css|js|woff|woff2|ttf)$/)
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get("admin_session")?.value
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    if (payload.role !== "admin") {
      const res = NextResponse.redirect(new URL("/login?error=unauthorized", request.url))
      res.cookies.delete("admin_session")
      return res
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
