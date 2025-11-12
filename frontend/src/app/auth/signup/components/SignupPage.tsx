"use client";
import Link from "next/link";
import { use, useState } from "react";
import {
  AuthButton,
  AuthContinueWithGoogle,
  AuthDividerLine,
  AuthHeader,
  AuthHeaderText,
  AuthInput,
  AuthRevertButton,
} from "../../template/auth-template";
import { useSignUpMutation } from "../mutations/signupMutation";
import { useLoginWithGoogle } from "../../login/queries/useLoginWithGoogle";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { SignupValidation, SignupValidationType } from "./signup-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/lib/utils";
export default function BrutalSignup() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate: signup, isPending } = useSignUpMutation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupValidationType>({
    resolver: zodResolver(SignupValidation),
  });
  const emailValue = useWatch({ control, name: "email" });

  const onSubmit = (data: SignupValidationType) => {
    signup(
      { data },
      {
        onSuccess: () => {
          toast.success(
            "Signup successful! Please check your email for verification.",
          );
          setIsSubmitted(true);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      },
    );
  };

    const { start } = useLoginWithGoogle();
 

  if (isSubmitted) {
    return (
      <AuthHeader>
        <div className="p-12 border-b-4 border-black">
          <div className="text-5xl mb-2">📧</div>
          <AuthHeaderText headerText="CHECK YOUR EMAIL" />
        </div>

        <div className="p-10">
          <p className="md:text-base text-md leading-relaxed mb-6 text-gray-900">
            We sent a verification link to{" "}
            <strong className="inline-block">{emailValue}</strong>
          </p>
          <div className="border-3 border-black bg-gray-100 p-6 text-center my-8">
            <div
              className="text-xs text-gray-600 uppercase tracking-widest mb-2"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              ⚡ Quick Stats
            </div>
            <div
              className="text-3xl font-black text-black mb-1"
              style={{ fontFamily: "Arial Black, sans-serif" }}
            >
              24 HOURS
            </div>
            <div className="text-sm text-gray-600">Until the link expires</div>
          </div>

          <div className="bg-black text-white p-5 border-3 border-black">
            <p
              className="text-sm leading-relaxed m-0"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              <strong>PRO TIP:</strong> Check your spam folder if you don't see
              it. Our emails are too cool for some spam filters.
            </p>
          </div>
        </div>
      </AuthHeader>
    );
  }
  console.log(errors.email?.message);
  return (
    <AuthHeader>
      <div className="p-12 border-b-4 border-black">
        <AuthHeaderText headerText="LET'S GET YOU HIRED" />
      </div>

      <div className="p-10">
        <p className="md:text-lg leading-relaxed mb-8 text-gray-900">
          Create your account and we'll match you with jobs that actually want
          you.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <AuthInput
            label="Email Address"
            type="email"
            className="w-full px-4 py-3 border-4 border-black text-lg focus:outline-none focus:ring-0"
            style={{ boxShadow: "4px 4px 0px #000000" }}
            placeholder="you@example.com"
            {...register("email")}
            error={errors.email?.message}
          />

          <AuthInput
            label="Password"
            type="password"
            className="w-full px-4 py-3 border-4 border-black text-lg focus:outline-none focus:ring-0"
            style={{ boxShadow: "4px 4px 0px #000000" }}
            placeholder="Make it strong"
            {...register("password")}
            error={errors.password?.message}
          />

          <AuthButton
            disabled={isPending}
            isLoading={isPending}
            text="CREATE ACCOUNT →"
          />
        </form>
        <AuthDividerLine />

        <AuthContinueWithGoogle onClick={start} />
      </div>

      <AuthRevertButton>
        <Link href="/auth/login">Log in here</Link>
      </AuthRevertButton>
    </AuthHeader>
  );
}
