import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/",
  "/resumes",
  "/cover-letters",
  "/analysis",
  "/Home",
];
const publicRoutes = [
  "/auth/login",
  "/auth/signup",
  "/auth/forget-password",
  "/auth/reset-password",
  "/auth/callback",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const isProtectedRoute =
    protectedRoutes.some((route) => pathname.includes(route)) ||
    pathname.includes("(user)");

  if (isProtectedRoute) {
    // Check if access_token cookie exists
    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
