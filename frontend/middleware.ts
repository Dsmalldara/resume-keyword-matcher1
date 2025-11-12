import { NextRequest, NextResponse } from "next/server";

// Define protected routes (routes that require authentication)
const protectedRoutes = ["/resumes", "/cover-letters", "/analysis", "/Home"];

// Define public routes (routes that don't require authentication)
const publicRoutes = [
  "/auth/login",
  "/auth/signup",
  "/auth/forget-password",
  "/auth/reset-password",
  "/auth/callback",
];

async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/validate`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.ok;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the requested path is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // If it's a public route, allow it
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if the requested path is a protected route or any route under (user) group
  const isProtectedRoute =
    protectedRoutes.some((route) => pathname.includes(route)) ||
    pathname.includes("(user)");

  if (isProtectedRoute) {
    // Get the access token from cookies
    const token = request.cookies.get("access_token")?.value;

    // If no token is found, redirect to login
    if (!token) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validate the token with the backend
    const isValid = await validateToken(token);

    // If token is invalid, redirect to login and clear the invalid token
    if (!isValid) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("access_token");
      return response;
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
