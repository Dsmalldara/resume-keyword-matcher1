// src/app/auth/callback/page.tsx
import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata, Viewport } from "next";
import AuthSignUpCallback from "./AuthSignUpCallback";
import { Suspense } from "react";

export const metadata: Metadata = generateMetadata({
  title: "Sign Up Callback",
  description:
    "Handle the callback after user sign up to verify authentication and redirect accordingly",
});

// Move viewport to separate export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading authentication...</p>
          </div>
        </div>
      }
    >
      <AuthSignUpCallback />
    </Suspense>
  );
}

export default Page;
