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

async function verifySession(request: NextRequest): Promise<boolean> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

    // Extract refresh token from cookies
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      console.error(
        `[verifySession] No refresh token found in request cookies`,
      );
      return false;
    }

    // Send refresh token in request body to backend
    const response = await fetch(`${baseUrl}/auth/verify-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.error(`[verifySession] Backend returned ${response.status}`);
      return false;
    }

    const data = await response.json();
    return data.valid === true;
  } catch (error) {
    console.error(`[verifySession] Error:`, error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`[Middleware] Processing request to: ${pathname}`);

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  console.log(`[Middleware] Is public route: ${isPublicRoute}`);
  if (isPublicRoute) {
    console.log(`[Middleware] Allowing public route: ${pathname}`);
    return NextResponse.next();
  }

  const isProtectedRoute =
    protectedRoutes.some((route) => pathname.includes(route)) ||
    pathname.includes("(user)");
  console.log(`[Middleware] Is protected route: ${isProtectedRoute}`);

  if (isProtectedRoute) {
    const refreshToken = request.cookies.get("refresh_token")?.value;
    console.log(`[Middleware] Has refresh token: ${!!refreshToken}`);

    if (!refreshToken) {
      console.log(`[Middleware] No refresh token, redirecting to login`);
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    console.log(`[Middleware] Verifying session with backend...`);
    const isValid = await verifySession(request);
    console.log(`[Middleware] Session valid: ${isValid}`);

    if (!isValid) {
      console.log(`[Middleware] Invalid session, redirecting to login`);
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url),
      );
      response.cookies.delete("refresh_token");
      response.cookies.delete("access_token");
      return response;
    }

    console.log(`[Middleware] Session valid, allowing access`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
