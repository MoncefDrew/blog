import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionFromRequest } from "@/lib/auth/session"

const PUBLIC_PATHS = ["/", "/about", "/reflections", "/links", "/posts"]

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const hasVisited = request.cookies.get("ds_visitor")
  const isNewVisitor = !hasVisited

  if (isPublicPath(request.nextUrl.pathname) && !request.nextUrl.pathname.startsWith("/writer")) {
    requestHeaders.set("x-new-visitor", isNewVisitor ? "1" : "0")
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const session = await getSessionFromRequest(request, response)

  if (request.nextUrl.pathname.startsWith("/writer")) {
    if (!session.isLoggedIn) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("from", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (request.nextUrl.pathname === "/login" && session.isLoggedIn) {
    return NextResponse.redirect(new URL("/writer", request.url))
  }

  if (isPublicPath(request.nextUrl.pathname) && isNewVisitor) {
    response.cookies.set("ds_visitor", "1", {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    })
  }

  return response
}

export const config = {
  matcher: ["/", "/about", "/reflections", "/links", "/posts/:path*", "/writer/:path*", "/login"],
}
