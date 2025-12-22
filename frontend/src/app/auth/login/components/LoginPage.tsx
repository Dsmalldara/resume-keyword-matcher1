"use client";
import Link from "next/link";
import { useLoginMutation } from "../mutations/LoginMutation";
import { useLoginWithGoogle } from "../queries/useLoginWithGoogle";
import { loginValidation, LoginValidationType } from "./login-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { storeAccessToken } from "@/api/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AuthContainer,
  AuthSidebar,
  AuthFormSection,
  AuthMobileHeader,
  AuthFormContainer,
  AuthBrandHeader,
  AuthPageHeader,
  ValuePropSection,
  SidebarFooter,
  AuthInput,
  PasswordInput,
  AuthDivider,
  GoogleAuthButton,
  AuthSubmitButton,
  AuthNavLink,
} from "../../components/modern-auth-template";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: LoginSubmit, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginValidationType>({
    resolver: zodResolver(loginValidation),
    mode: "onChange",
  });

  const { start } = useLoginWithGoogle();

  const onSubmit = (data: LoginValidationType) => {
    LoginSubmit(
      { data },
      {
        onSuccess: (response) => {
          toast.success("Signed in successfully");
          storeAccessToken(response.access_token || "");
          setTimeout(() => router.push("/home"), 1000);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      },
    );
  };

  return (
    <AuthContainer>
      <AuthSidebar>
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
              title: "Cover Letter Assistance",
              description:
                "Get help crafting personalized cover letters that highlight your strengths, using insights from various resumes uploaded and job descriptions analyzed.",
            },
          ]}
        />
        <SidebarFooter>
          Join hundreds of professionals using Resume Keys to land their dream
          roles.
        </SidebarFooter>
      </AuthSidebar>

      <AuthFormSection>
        <AuthFormContainer>
          <AuthPageHeader
            title="Welcome back"
            subtitle="Continue to your resume analysis dashboard"
          />

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <AuthInput
              label="Email address"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors.password?.message}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              {...register("password")}
            />

            <div className="flex justify-end">
              <Link
                href="/auth/forget-password"
                className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <AuthSubmitButton
              text="Sign in"
              isLoading={isPending}
              disabled={!isValid}
            />
          </form>

          <AuthDivider />

          <GoogleAuthButton onClick={start} />

          <AuthNavLink
            text="Don't have an account?"
            linkText="Create one"
            href="/auth/signup"
            LinkComponent={Link}
          />
        </AuthFormContainer>
      </AuthFormSection>
    </AuthContainer>
  );
}
