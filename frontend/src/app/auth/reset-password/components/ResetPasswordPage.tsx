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
  useCreateResetPassword,
  useVerifyResetToken,
} from "../mutations/ResetPasswordMutation";
import { useSearchParams } from "next/navigation";
import {
  AuthContainer,
  AuthSidebar,
  AuthFormSection,
  AuthFormContainer,
  AuthPageHeader,
  AuthBrandHeader,
  ValuePropSection,
  SidebarFooter,
  AuthInput,
  PasswordInput,
  AuthSubmitButton,
  AuthNavLink,
} from "../../components/modern-auth-template";
import {
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Lock,
} from "lucide-react";
import Link from "next/link";

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

  return (
    <AuthContainer>
      {/* Desktop Sidebar */}
      <AuthSidebar>
        <div>
          <AuthBrandHeader title="Secure Access" />
          <ValuePropSection
            items={[
              {
                title: "Protected",
                description: "End-to-end encrypted password reset",
              },
              {
                title: "Fast",
                description: "Instant verification and setup",
              },
              {
                title: "Verified",
                description: "Secure token validation",
              },
            ]}
          />
        </div>
        <SidebarFooter>
          Your password is encrypted and secure. Reset links expire after 1
          hour.
        </SidebarFooter>
      </AuthSidebar>

      {/* Main Form Section */}
      <AuthFormSection>
        <AuthFormContainer>
          {/* Verifying State */}
          {status === "verifying" && (
            <div className="text-center space-y-8">
              <div className="flex justify-center">
                <div className="relative w-16 h-16">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full animate-spin"
                    style={{ backgroundSize: "200% 200%" }}
                  />
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 text-blue-600 animate-pulse" />
                  </div>
                </div>
              </div>
              <AuthPageHeader
                title="Verifying Your Link"
                subtitle="Please wait while we validate your password reset request"
              />
              <p className="text-slate-600 text-base">{message}</p>
            </div>
          )}

          {/* Valid State - Password Form */}
          {status === "valid" && (
            <div className="space-y-8">
              <AuthPageHeader
                title="Create New Password"
                subtitle="Choose a strong password to secure your account"
              />

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <PasswordInput
                  label="New Password"
                  placeholder="At least 8 characters"
                  error={errors.password?.message}
                  showPassword={false}
                  onTogglePassword={() => {}}
                  {...register("password")}
                />

                <AuthSubmitButton
                  text={isCreating ? "Resetting Password..." : "Reset Password"}
                  isLoading={isCreating}
                  disabled={isCreating}
                  type="submit"
                />
              </form>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium">
                  💡 Pro tip: Use a mix of uppercase, lowercase, numbers, and
                  symbols for maximum security.
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="text-center space-y-8">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-600 animate-bounce" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Password Reset Successful
                </h2>
                <p className="text-slate-600">
                  Your account is now secured with your new password.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-900 font-medium">
                  ✓ Redirecting to login in a few moments...
                </p>
              </div>
            </div>
          )}

          {/* Error/Expired State */}
          {(status === "expired" || status === "error") && (
            <div className="text-center space-y-8">
              <div className="flex justify-center">
                <AlertCircle className="w-16 h-16 text-red-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {status === "expired" ? "Link Expired" : "Invalid Link"}
                </h2>
                <p className="text-slate-600">{message}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-900 font-medium">
                  🔐 For security, reset links expire after 1 hour. Please
                  request a new one.
                </p>
              </div>

              <button
                onClick={() => router.push("/auth/forget-password")}
                className="w-full py-3 px-4 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors mt-8"
              >
                Request New Reset Link
              </button>
            </div>
          )}

          {/* Back to Login Link */}
          {status !== "verifying" && (
            <div className="text-center">
              <AuthNavLink
                text="Need help?"
                linkText="Back to Login"
                href="/auth/login"
                LinkComponent={Link}
              />
            </div>
          )}
        </AuthFormContainer>
      </AuthFormSection>
    </AuthContainer>
  );
}
