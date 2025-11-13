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

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

async function verifySession(refreshToken: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.getUser(refreshToken);
    return !error && !!data.user;
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
    const isValid = await verifySession(refreshToken);
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
