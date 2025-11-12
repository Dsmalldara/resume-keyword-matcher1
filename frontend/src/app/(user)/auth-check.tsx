"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAccessToken } from "@/api/client";

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      // Redirect to login with the original path
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Validate token with backend
    const validateToken = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/validate`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 401 || response.status === 403) {
          // Invalid token, clear it and redirect to login
          sessionStorage.removeItem("access_token");
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        // On error, still allow the page to load - API errors will be handled by the API calls
      }
    };

    validateToken();
  }, [router, pathname]);

  return <>{children}</>;
}
