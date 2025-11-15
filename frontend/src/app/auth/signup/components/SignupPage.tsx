"use client";
import Link from "next/link";
import { useState } from "react";
import { useSignUpMutation } from "../mutations/signupMutation";
import { useLoginWithGoogle } from "../../login/queries/useLoginWithGoogle";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { SignupValidation, SignupValidationType } from "./signup-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/lib/utils";
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
  TermsDisclaimer,
  AuthDivider,
  GoogleAuthButton,
  AuthSubmitButton,
  AuthNavLink,
  VerificationContainer,
  VerificationHeader,
  EmailDisplay,
  VerificationSteps,
  InfoBox,
  InfoBoxContainer,
  VerificationActionButton,
} from "../../components/modern-auth-template";

export default function SignupPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: signup, isPending } = useSignUpMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<SignupValidationType>({
    resolver: zodResolver(SignupValidation),
    mode: "onChange",
  });

  const emailValue = useWatch({ control, name: "email" });
  const { start } = useLoginWithGoogle();

  const onSubmit = (data: SignupValidationType) => {
    signup(
      { data },
      {
        onSuccess: () => {
          toast.success("Account created successfully");
          setIsSubmitted(true);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      },
    );
  };

  if (isSubmitted) {
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
          <VerificationContainer>
            <VerificationHeader
              title="Check your email"
              subtitle="We sent a verification link to confirm your email address"
            />
            <EmailDisplay email={emailValue} />
            <VerificationSteps
              steps={[
                "Click the link in your email to verify",
                "Complete your profile information",
                "Start uploading resumes and getting insights",
              ]}
            />
            <InfoBoxContainer>
              <InfoBox
                title="Link expires"
                message="24 hours from now"
                variant="info"
              />
              <InfoBox
                title="Tip"
                message="Check your spam folder if you don't see the verification email"
                variant="warning"
              />
            </InfoBoxContainer>
            <VerificationActionButton
              text="Back to sign in"
              href="/auth/login"
              LinkComponent={Link}
            />
          </VerificationContainer>
        </AuthFormSection>
      </AuthContainer>
    );
  }

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
        <AuthMobileHeader
          title="Resume Keys"
          subtitle="Master your resume, master your career"
        />
        <AuthFormContainer>
          <AuthPageHeader
            title="Get started"
            subtitle="Create your account in seconds"
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
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              error={errors.password?.message}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              {...register("password")}
            />

            <AuthSubmitButton
              text="Create account"
              isLoading={isPending}
              disabled={!isValid}
            />
          </form>

          <AuthDivider />

          <GoogleAuthButton onClick={start} />

          <AuthNavLink
            text="Already have an account?"
            linkText="Sign in"
            href="/auth/login"
            LinkComponent={Link}
          />
        </AuthFormContainer>
      </AuthFormSection>
    </AuthContainer>
  );
}
