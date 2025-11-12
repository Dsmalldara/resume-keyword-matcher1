"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { storeAccessToken } from "@/api/client";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthHeader, AuthButton } from "../template/auth-template";

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
          console.log(data.session.access_token);

          setTimeout(() => {
            router.push("/");
          }, 2000);
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
    <AuthHeader>
      {/* Header */}
      <div className="p-12 border-b-4 border-black text-center">
        <div className="text-5xl mb-4">
          {status === "loading" && "⏳"}
          {status === "success" && "✅"}
          {status === "error" && "❌"}
        </div>
        <h1
          className="text-4xl font-black tracking-tight"
          style={{ fontFamily: "Arial Black, sans-serif" }}
        >
          {status === "loading" && "VERIFYING..."}
          {status === "success" && "SUCCESS!"}
          {status === "error" && "OOPS!"}
        </h1>
      </div>

      {/* Content */}
      <div className="p-10">
        {/* Loading State */}
        {status === "loading" && (
          <>
            <p className="text-lg leading-relaxed mb-8 text-gray-900 text-center">
              {message}
            </p>

            {/* Brutal spinner */}
            <div className="flex justify-center mb-8">
              <div
                className="w-16 h-16 border-4 border-black animate-spin"
                style={{
                  borderTopColor: "transparent",
                  borderRadius: "0",
                }}
              />
            </div>

            {/* Progress bar */}
            <div className="border-4 border-black bg-gray-200 h-8 relative overflow-hidden">
              <div
                className="bg-yellow-400 h-full border-r-4 border-black animate-pulse"
                style={{ width: "75%" }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center font-bold text-sm"
                style={{ fontFamily: "Courier New, monospace" }}
              >
                AUTHENTICATING...
              </div>
            </div>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <div
              className="border-4 border-green-600 bg-green-50 p-6 mb-6"
              style={{ boxShadow: "6px 6px 0px #16A34A" }}
            >
              <p
                className="text-lg font-bold text-green-900 text-center"
                style={{ fontFamily: "Courier New, monospace" }}
              >
                {message}
              </p>
            </div>

            <div className="border-3 border-black bg-gray-100 p-6 text-center">
              <div
                className="text-xs text-gray-600 uppercase tracking-widest mb-2"
                style={{ fontFamily: "Courier New, monospace" }}
              >
                ⚡ Status
              </div>
              <div
                className="text-3xl font-black text-black mb-1"
                style={{ fontFamily: "Arial Black, sans-serif" }}
              >
                AUTHENTICATED
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-2 mt-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Redirecting to dashboard...
              </div>
            </div>
          </>
        )}

        {/* Error State */}
        {status === "error" && (
          <>
            <div
              className="border-4 border-red-600 bg-red-50 p-6 mb-6"
              style={{ boxShadow: "6px 6px 0px #DC2626" }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <div
                    className="font-black uppercase text-sm mb-2 text-red-900"
                    style={{ fontFamily: "Arial Black, sans-serif" }}
                  >
                    AUTHENTICATION FAILED
                  </div>
                  <p
                    className="text-sm text-red-800"
                    style={{ fontFamily: "Courier New, monospace" }}
                  >
                    {message}
                  </p>
                </div>
              </div>
            </div>

            <AuthButton
              text="RETURN TO LOGIN →"
              onClick={() => router.push("/auth/login")}
            />

            <p
              className="mt-6 text-center text-sm text-gray-600"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              Auto-redirecting in 3 seconds...
            </p>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-8 bg-gray-50 border-t-4 border-black">
        <p
          className="text-sm text-gray-600 text-center m-0"
          style={{ fontFamily: "Courier New, monospace" }}
        >
          {status === "loading" &&
            "Please wait while we verify your credentials"}
          {status === "success" && "Welcome back! Your session is now active"}
          {status === "error" && "Need help? Contact support@resumematcher.com"}
        </p>
      </div>
    </AuthHeader>
  );
}
