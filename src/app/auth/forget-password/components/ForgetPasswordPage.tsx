"use client";
import { useState } from "react";
import {
  AuthButton,
  AuthHeader,
  AuthHeaderText,
  AuthInput,
  AuthRevertButton,
} from "../../template/auth-template";
import { Link } from "lucide-react";
import { forgetPasswordValidation } from "./forgetpassword-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { useForgetPasswordMutation } from "../mutations/forgetPasswordMutation";

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate, isPending, isError } = useForgetPasswordMutation();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<forgetPasswordValidation>({
    resolver: zodResolver(forgetPasswordValidation),
  });

  const onSubmit = (data: forgetPasswordValidation) => {
    mutate(
      { data },
      {
        onSuccess: () => {
          toast.success(
            "If an account exists, a reset link has been sent to your email.",
          );
          setIsSubmitted(true);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      },
    );
  };

  const emailValue = useWatch({ control, name: "email" });

  if (isSubmitted) {
    return (
      <AuthHeader>
        <AuthHeaderText headerText="CHECK YOUR EMAIL" />

        <div className="p-10">
          <p className="text-lg leading-relaxed mb-6 text-gray-900">
            If an account exists for <strong>{emailValue}</strong>, you'll
            receive password reset instructions shortly.
          </p>

          <div className="border-3 border-black bg-gray-100 p-6 text-center my-8">
            <div
              className="text-xs text-gray-600 uppercase tracking-widest mb-2"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              ⏱️ Link Valid For
            </div>
            <div
              className="text-3xl font-black text-black mb-1"
              style={{ fontFamily: "Arial Black, sans-serif" }}
            >
              1 HOUR
            </div>
            <div className="text-sm text-gray-600">
              After that, request a new one
            </div>
          </div>

          <div className="bg-black text-white p-5 border-3 border-black mb-6">
            <p
              className="text-sm leading-relaxed m-0"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              <strong>PRO TIP:</strong> Check your spam folder. Sometimes our
              emails like to play hide and seek.
            </p>
          </div>

          <AuthRevertButton>
            <Link href="/auth/login">← Back to Login</Link>
          </AuthRevertButton>
        </div>
      </AuthHeader>
    );
  }

  return (
    <AuthHeader>
      <AuthHeaderText headerText="FORGOT YOUR PASSWORD?" />

      <div className="p-10">
        <p className="text-lg leading-relaxed mb-8 text-gray-900">
          No worries. Enter your email and we'll send you reset instructions.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <AuthInput
            label="Email Address"
            type="email"
            {...register("email")}
            className="w-full px-4 py-3 border-4 border-black text-lg focus:outline-none focus:ring-0"
            style={{ boxShadow: "4px 4px 00px #000000" }}
            placeholder="you@example.com"
            error={errors.email?.message}
          />

          {/* submit button */}
          <AuthButton
            text=" SEND RESET LINK →"
            type="submit"
            isLoading={isPending}
          />

          <AuthRevertButton>
            <Link href="/auth/login">← Back to Login</Link>
          </AuthRevertButton>
        </form>

        <div className="mt-8 border-3 border-black bg-gray-100 p-6">
          <div
            className="text-xs text-gray-600 uppercase tracking-widest mb-3"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            🛡️ Security Note
          </div>
          <p className="text-sm text-gray-700 leading-relaxed m-0">
            For security reasons, we'll send the reset link even if the email
            doesn't exist in our system. This prevents bad actors from
            discovering valid accounts.
          </p>
        </div>
      </div>

      <div className="p-8 bg-gray-50 border-t-4 border-black">
        <p
          className="text-sm text-gray-600 m-0"
          style={{ fontFamily: "Courier New, monospace" }}
        >
          Remember your password?{" "}
          <span className="font-bold text-black underline cursor-pointer">
            Log in here
          </span>
        </p>
      </div>
    </AuthHeader>
  );
}
