"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/supabaseClient";
import { storeAccessToken, getAccessToken } from "@/api/client";
import { getErrorMessage } from "@/lib/utils";
import {
  AuthHeader,
  AuthInput,
  AuthButton,
} from "../../template/auth-template";
import {
  useCreateResetPassword,
  useVerifyResetToken,
} from "../mutations/ResetPasswordMutation";
import { useSearchParams } from "next/navigation";

type Status = "verifying" | "valid" | "expired" | "error" | "success";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  access_token: z.string().min(1, "Access token is required"),
});
type ResetPasswordFormSchema = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("Verifying your reset link...");
  const { mutate, isPending } = useVerifyResetToken();
  const { mutate: createNewPassword, isPending: isCreating } =
    useCreateResetPassword();

  const params = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordFormSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // ✅ Step 1: Verify reset link on load
  useEffect(() => {
    const hash = window.location.hash;

    // Handle Supabase error params
    if (hash.includes("error_code=otp_expired")) {
      setStatus("expired");
      setMessage("This reset link has expired. Please request a new one.");
      return;
    }

    const verifySession = async () => {
      try {
        // ✅ 1. Let Supabase parse the URL hash and set the session
        const { data: sessionData, error: sessionError } =
          await supabase.auth.exchangeCodeForSession(hash);
        if (sessionError) console.warn("exchangeCodeForSession:", sessionError);

        // ✅ 2. Then get the session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.access_token) {
          console.log(session);
          const access_token = session.access_token;

          storeAccessToken(access_token);
          setValue("access_token", access_token);

          mutate(
            { data: { access_token } },
            {
              onSuccess: () => setStatus("valid"),
              onError: (err) => {
                setStatus("error");
                setMessage("Invalid or expired link.");
                toast.error(getErrorMessage(err));
              },
            },
          );
        } else {
          setStatus("error");
          setMessage(
            "No valid session found. Please request a new reset link.",
          );
        }
      } catch (err) {
        console.error("Verification failed:", err);
        setStatus("error");
        setMessage("Could not verify reset link.");
      }
    };

    verifySession();
  }, [mutate, setValue]);

  // ✅ Step 2: Handle password reset
  // ✅ Step 1: Verify reset link on load
  // ✅ Step 1: Verify reset link on load
  useEffect(() => {
    const verifySession = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const errorCode = params.get("error_code");

        if (errorCode === "otp_expired") {
          setStatus("expired");
          setMessage("This reset link has expired. Please request a new one.");
          return;
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.access_token) {
          console.log("Session found:", session);
          setStatus("valid");
        } else {
          setStatus("error");
          setMessage(
            "No valid session found. Please request a new reset link.",
          );
        }
      } catch (err) {
        console.error("Verification failed:", err);
        setStatus("error");
        setMessage("Could not verify reset link.");
      }
    };

    verifySession();
  }, []);

  // ✅ Step 2: Handle password reset directly with Supabase (no backend call)
  const onSubmit = async (data: ResetPasswordFormSchema) => {
    if (status !== "valid") return;

    try {
      // ✅ Update password directly using Supabase client
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Password reset successful! Redirecting...");
      setStatus("success");

      // Optional: Sign out to force fresh login
      await supabase.auth.signOut();

      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    }
  };

  // ✅ Step 2: Handle password reset

  // Step 3: Conditional rendering
  return (
    <AuthHeader>
      {/* Header */}
      <div className="p-12 border-b-4 border-black text-center">
        <div className="text-5xl mb-4">
          {status === "verifying" && "⏳"}
          {status === "valid" && "🔐"}
          {status === "expired" && "⏰"}
          {status === "error" && "❌"}
          {status === "success" && "✅"}
        </div>
        <h1
          className="text-4xl font-black tracking-tight"
          style={{ fontFamily: "Arial Black, sans-serif" }}
        >
          {status === "verifying" && "VERIFYING..."}
          {status === "valid" && "RESET PASSWORD"}
          {status === "expired" && "LINK EXPIRED"}
          {status === "error" && "INVALID LINK"}
          {status === "success" && "PASSWORD RESET!"}
        </h1>
      </div>

      {/* Body */}
      <div className="p-10">
        {/* Verifying */}
        {status === "verifying" && (
          <>
            <p className="text-lg leading-relaxed mb-8 text-gray-900 text-center">
              {message}
            </p>
            <div className="flex justify-center mb-8">
              <div
                className="w-16 h-16 border-4 border-black animate-spin"
                style={{
                  borderTopColor: "transparent",
                  borderRadius: "0",
                }}
              />
            </div>
            <div className="border-4 border-black bg-gray-200 h-8 relative overflow-hidden">
              <div
                className="bg-yellow-400 h-full border-r-4 border-black animate-pulse"
                style={{ width: "75%" }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center font-bold text-sm"
                style={{ fontFamily: "Courier New, monospace" }}
              >
                Verifying...
              </div>
            </div>
          </>
        )}

        {/* Valid → Password Form */}
        {status === "valid" && (
          <>
            <p className="text-lg leading-relaxed mb-8 text-gray-900 text-center">
              Choose a strong password. Make it count this time.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <AuthInput
                label="New Password"
                type="password"
                placeholder="At least 8 characters"
                error={errors.password?.message}
                {...register("password")}
              />

              <AuthButton
                text={isPending ? "RESETTING..." : "RESET PASSWORD →"}
                isLoading={isCreating}
                disabled={isCreating}
                type="submit"
              />
            </form>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <div className="text-center">
            <div className="border-4 border-green-600 bg-green-50 p-6 mb-6 shadow-lg">
              <p
                className="text-lg font-bold text-green-900"
                style={{ fontFamily: "Courier New, monospace" }}
              >
                Your password has been successfully updated!
              </p>
            </div>
            <p className="text-sm text-gray-600">Redirecting to login...</p>
          </div>
        )}

        {/* Expired/Error */}
        {(status === "expired" || status === "error") && (
          <div className="text-center">
            <div className="border-4 border-red-600 bg-red-50 p-6 mb-6 shadow-lg">
              <p
                className="text-lg font-bold text-red-900"
                style={{ fontFamily: "Courier New, monospace" }}
              >
                {message}
              </p>
            </div>

            <AuthButton
              text="REQUEST NEW LINK →"
              onClick={() => router.push("/auth/forgot-password")}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-8 bg-gray-50 border-t-4 border-black">
        <p
          className="text-sm text-gray-600 text-center m-0"
          style={{ fontFamily: "Courier New, monospace" }}
        >
          {status === "verifying" &&
            "Please wait while we verify your reset link"}
          {status === "valid" && "Your reset link is valid and secure"}
          {status === "expired" &&
            "Security first — expired links cannot be used"}
          {status === "error" && "Need help? Contact support@resumematcher.com"}
          {status === "success" && "You can now log in with your new password"}
        </p>
      </div>
    </AuthHeader>
  );
}
