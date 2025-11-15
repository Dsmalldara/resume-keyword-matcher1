"use client";
import { useState } from "react";
import {
  AuthContainer,
  AuthSidebar,
  AuthFormSection,
  AuthFormContainer,
  AuthBrandHeader,
  AuthPageHeader,
  ValuePropSection,
  SidebarFooter,
  AuthInput,
  AuthSubmitButton,
  AuthNavLink,
} from "../../components/modern-auth-template";
import { Mail, Shield, Clock, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
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
      <AuthContainer>
        {/* Desktop Sidebar */}
        <AuthSidebar>
          <div>
            <AuthBrandHeader title="Secure Reset" />
            <ValuePropSection
              items={[
                {
                  title: "Email Sent",
                  description: "Check your inbox for reset instructions",
                },
                {
                  title: "Time-Limited",
                  description: "Link valid for 1 hour for security",
                },
                {
                  title: "Protected",
                  description: "Your account remains secure",
                },
              ]}
            />
          </div>
          <SidebarFooter>
            Your privacy is our priority. All emails are encrypted and secure.
          </SidebarFooter>
        </AuthSidebar>

        {/* Main Form Section */}
        <AuthFormSection>
          <AuthFormContainer>
            <div className="text-center space-y-8">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-600 animate-bounce" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Check Your Email
                </h2>
                <p className="text-slate-600">
                  If an account exists for <strong>{emailValue}</strong>, you'll
                  receive password reset instructions shortly.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-blue-900">
                      Link Valid For 1 Hour
                    </p>
                    <p className="text-xs text-blue-700">
                      After that, request a new one
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900">
                  💡 <strong>Pro Tip:</strong> Check your spam folder if you
                  don't see the email within a few minutes.
                </p>
              </div>

              <AuthNavLink
                text="Ready to log in?"
                linkText="Back to Login"
                href="/auth/login"
                LinkComponent={Link}
              />
            </div>
          </AuthFormContainer>
        </AuthFormSection>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer>
      {/* Desktop Sidebar */}
      <AuthSidebar>
        <div>
          <AuthBrandHeader title="Password Help" />
          <ValuePropSection
            items={[
              {
                title: "Quick Reset",
                description: "Instant reset link to your email",
              },
              {
                title: "Secure",
                description: "Military-grade encryption for your safety",
              },
              {
                title: "Fast",
                description: "Receive instructions in seconds",
              },
            ]}
          />
        </div>
        <SidebarFooter>
          Your privacy is our priority. All emails are encrypted and secure.
        </SidebarFooter>
      </AuthSidebar>

      {/* Main Form Section */}
      <AuthFormSection>
        <AuthFormContainer>
          <div className="space-y-8">
            <AuthPageHeader
              title="Forgot Your Password?"
              subtitle="No worries. Enter your email and we'll send you reset instructions."
            />

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <AuthInput
                label="Email Address"
                type="email"
                {...register("email")}
                placeholder="you@example.com"
                error={errors.email?.message}
              />

              <AuthSubmitButton
                text={isPending ? "Sending..." : "Send Reset Link"}
                isLoading={isPending}
                disabled={isPending}
                type="submit"
              />
            </form>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>Security Note:</strong> For your protection, we send
                reset links even if the email doesn't exist in our system. This
                prevents bad actors from discovering valid accounts.
              </p>
            </div>

            <div className="text-center">
              <AuthNavLink
                text="Remember your password?"
                linkText="Log in here"
                href="/auth/login"
                LinkComponent={Link}
              />
            </div>
          </div>
        </AuthFormContainer>
      </AuthFormSection>
    </AuthContainer>
  );
}
