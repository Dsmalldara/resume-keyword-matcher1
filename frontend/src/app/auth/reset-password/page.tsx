import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import ResetPasswordPage from "./components/ResetPasswordPage";
import { Suspense } from "react";

export const metadata: Metadata = generateMetadata({
  title: "Reset Password",
  description:
    "Reset your account password to regain access and ensure security",
});

function page() {
  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          </div>
        }
      >
        <ResetPasswordPage />
      </Suspense>
    </>
  );
}

export default page;
