"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { storeAccessToken } from "@/api/client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AuthContainer,
  AuthSidebar,
  AuthFormSection,
  AuthBrandHeader,
  ValuePropSection,
  SidebarFooter,
} from "../components/modern-auth-template";

type AuthStatus = "loading" | "success" | "error";

export default function AuthSignUpCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [message, setMessage] = useState("Verifying your authentication...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data.session) {
          setStatus("success");
          setMessage("Authentication successful! Redirecting...");
          // Store the access token
          storeAccessToken(data.session.access_token);

          setTimeout(() => {
            router.push("/Home");
          }, 500);
        } else {
          throw new Error("No session found. Please try logging in again.");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to verify authentication",
        );

        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <AuthContainer>
      <AuthSidebar>
        <AuthBrandHeader title="Resume Keys" />
        <ValuePropSection
          items={[
            {
              title: "Smart Analysis",
              description:
                "Upload multiple resumes and get instant AI-powered insights on your qualifications.",
            },
            {
              title: "Job Fit Intelligence",
              description:
                "Extract job requirements and receive personalized recommendations for positions that match your profile.",
            },
            {
              title: "Career Growth",
              description:
                "Identify skill gaps and get actionable insights to improve your candidacy.",
            },
          ]}
        />
        <SidebarFooter>
          Join hundreds of professionals using Resume Keys to land their dream
          roles.
        </SidebarFooter>
      </AuthSidebar>

      <AuthFormSection>
        <div className="w-full max-w-md">
          {/* Loading State */}
          {status === "loading" && (
            <div className="text-center space-y-8">
              <div className="flex justify-center">
                <div className="animate-spin">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-black mb-2 bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                  Verifying...
                </h2>
                <p className="text-slate-600 font-medium">{message}</p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                <p className="text-sm text-slate-700 font-medium">
                  Please wait while we verify your credentials
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="text-center space-y-8">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-4xl lg:text-5xl font-black mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Welcome!
                </h2>
                <p className="text-slate-600 font-medium text-lg">{message}</p>
              </div>
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                  <p className="text-sm text-slate-700 font-medium">
                    Redirecting to dashboard...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="text-center space-y-8">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-4xl lg:text-5xl font-black mb-3 bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  Oops!
                </h2>
                <p className="text-slate-600 font-medium">{message}</p>
              </div>
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <p className="text-sm text-slate-700 font-medium mb-4">
                  Authentication failed
                </p>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl uppercase tracking-wide text-sm"
                >
                  Return to Login
                </button>
              </div>
              <p className="text-sm text-slate-600 font-medium">
                Auto-redirecting in 3 seconds...
              </p>
            </div>
          )}
        </div>
      </AuthFormSection>
    </AuthContainer>
  );
}
