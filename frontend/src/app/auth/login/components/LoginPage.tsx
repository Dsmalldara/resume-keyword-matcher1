"use client";
import { useState } from "react";
import {
  AuthButton,
  AuthContinueWithGoogle,
  AuthDividerLine,
  AuthHeader,
  AuthHeaderText,
  AuthInput,
  AuthRevertButton,
} from "../../template/auth-template";
import Link from "next/link";
import { useLoginMutation } from "../mutations/LoginMutation";
import { loginValidation, LoginValidationType } from "./login-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const router = useRouter();
  const { mutate: LoginSubmit, isPending, isError } = useLoginMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginValidationType>({ resolver: zodResolver(loginValidation) });

  const handleGoogleLogin = () => {
    // Handle Google OAuth logic here
    console.log("Login with Google");
  };
  const onSubmit = (data: LoginValidationType) => {
    LoginSubmit(
      { data },
      {
        onSuccess: () => {
          toast.success("Login successful!");
          setTimeout(() => {
            router.push("/");
          }, 1000);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      },
    );
  };

  return (
    <AuthHeader>
      <AuthHeaderText headerText="WELCOME BACK" />
      <div className="p-10">
        <p className="text-lg leading-relaxed mb-8 text-gray-900">
          Log in to continue your job search journey.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <AuthInput
            label="Email Address"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            className="w-full px-4 py-3 border-4 border-black text-lg focus:outline-none focus:ring-0"
            style={{ boxShadow: "4px 4px 0px #000000" }}
            placeholder="you@example.com"
          />

          <div>
            <AuthInput
              label="Password"
              type="password"
              {...register("password")}
              error={errors.password?.message}
              className="w-full px-4 py-3 border-4 border-black text-lg focus:outline-none focus:ring-0"
              style={{ boxShadow: "4px 4px 0px #000000" }}
              placeholder="Enter your password"
            />
            <AuthRevertButton>
              <Link href="/auth/forget-password">Forgot Password?</Link>
            </AuthRevertButton>
          </div>

          <AuthButton
            text="LOG IN →"
            type="submit"
            disabled={isPending}
            isLoading={isPending}
          />

          <AuthDividerLine />
        </form>
        <AuthContinueWithGoogle onClick={handleGoogleLogin} />
      </div>

      <div className="p-8 bg-gray-50 border-t-4 border-black">
        <p
          className="text-sm text-gray-600 m-0"
          style={{ fontFamily: "Courier New, monospace" }}
        >
          Don't have an account?{" "}
          <span className="font-bold text-black underline cursor-pointer">
            <Link href="/auth/signup">Sign up here</Link>
          </span>
        </p>
      </div>
    </AuthHeader>
  );
}
