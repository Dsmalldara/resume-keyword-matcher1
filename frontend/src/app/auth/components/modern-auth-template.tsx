import { Brain, FileText, Target } from "lucide-react";
import React from "react";

/**
 * Modern Auth Component Library
 * Clean, startup-grade design system for authentication pages
 * Serves as single source of truth for login/signup UI
 */

/* ==================== Container & Layout ==================== */

export const AuthContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 flex flex-col lg:flex-row w-full">
    {children}
  </div>
);

export const AuthSidebar = ({ children }: { children: React.ReactNode }) => (
  <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-800 text-white flex-col justify-between p-12">
    {children}
  </div>
);

export const AuthFormSection = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-8 min-h-screen lg:min-h-auto">
    {children}
  </div>
);

export const AuthMobileHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div className="w-full max-w-md lg:hidden mb-8">
    <h1
      className="text-6xl font-black tracking-tight mb-2 bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent"
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: "900",
        letterSpacing: "-0.02em",
      }}
    >
      {title}
    </h1>
    <p className="text-blue-600 text-sm font-semibold mt-2">{subtitle}</p>
  </div>
);

export const AuthFormContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="w-full max-w-md">{children}</div>;

/* ==================== Typography & Headers ==================== */

export const AuthBrandHeader = ({ title }: { title: string }) => (
  <div className="my-6">
    <h1
      className="text-6xl font-black tracking-tight mb-2 text-white"
      style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: "900",
        letterSpacing: "-0.02em",
      }}
    >
      {title}
    </h1>
  </div>
);
export const AuthPageHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div className="mb-10">
    <link
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
    <h2
      className="text-4xl font-bold my-6"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        letterSpacing: "-0.025em",
      }}
    >
      {title}
    </h2>

    <p className="text-slate-600 font-medium text-base">{subtitle}</p>
  </div>
);

/* ==================== Value Propositions ==================== */

export const ValuePropSection = ({
  items,
  icon,
}: {
  items: Array<{ title: string; description: string }>;
  icon?: React.ComponentType<any>[];
}) => {
  const icons = [Brain, Target, FileText];

  return (
    <div className="grid gap-6 md:gap-8">
      {items.map((item, idx) => {
        const Icon = icons[idx % icons.length];
        return (
          <div
            key={idx}
            className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold mb-2 text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-blue-100/90 leading-relaxed text-[15px]">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const SidebarFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="pt-8 border-t border-blue-700/30">
    <p className="text-blue-100 text-sm leading-relaxed font-medium">
      {children}
    </p>
  </div>
);

/* ==================== Form Inputs ==================== */

export type AuthInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const AuthInput = ({ label, error, ...props }: AuthInputProps) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-900 mb-2">
        {label}
      </label>
      <input
        className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 text-base ${
          error
            ? "border-red-300 bg-red-50 focus:ring-red-500"
            : "border-slate-200 bg-white focus:ring-slate-900"
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export const PasswordInput = ({
  label,
  error,
  showPassword,
  onTogglePassword,
  ...props
}: AuthInputProps & {
  showPassword: boolean;
  onTogglePassword: () => void;
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-900 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 text-base ${
            error
              ? "border-red-300 bg-red-50 focus:ring-red-500"
              : "border-slate-200 bg-white focus:ring-slate-900"
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 text-sm font-medium"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export const TermsDisclaimer = ({
  children,
}: {
  children: React.ReactNode;
}) => <p className="text-xs text-slate-500 font-light">{children}</p>;

/* ==================== Buttons ==================== */

export const AuthSubmitButton = ({
  text,
  isLoading,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  isLoading?: boolean;
}) => (
  <button
    type="submit"
    disabled={disabled || isLoading}
    className="w-full py-3 px-4 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed mt-8"
    {...props}
  >
    {isLoading ? "Loading..." : text}
  </button>
);

export const GoogleAuthButton = ({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="w-full py-3 px-4 border border-slate-200 text-slate-900 font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
    {...props}
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
    Continue with Google
  </button>
);

/* ==================== Dividers & Separators ==================== */

export const AuthDivider = () => (
  <div className="flex items-center gap-3 my-8">
    <div className="flex-1 h-px bg-slate-200"></div>
    <span className="text-sm text-slate-500">Or</span>
    <div className="flex-1 h-px bg-slate-200"></div>
  </div>
);

/* ==================== Links & Navigation ==================== */

export const AuthNavLink = ({
  text,
  linkText,
  href,
  LinkComponent,
}: {
  text: string;
  linkText: string;
  href: string;
  LinkComponent: React.ComponentType<{
    href: string;
    children: React.ReactNode;
    className?: string;
  }>;
}) => {
  const Link = LinkComponent;
  return (
    <p className="text-center text-slate-600 mt-8">
      {text}
      <Link
        href={href}
        className="ml-1 text-slate-900 font-semibold hover:underline"
      >
        {linkText}
      </Link>
    </p>
  );
};

/* ==================== Email Verification Screen ==================== */

export const VerificationContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="w-full max-w-md">
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-6">
        <span className="text-3xl">→</span>
      </div>
      {children}
    </div>
  </div>
);

export const VerificationHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <>
    <h2
      className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2"
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontWeight: "700",
        letterSpacing: "-0.01em",
      }}
    >
      {title}
    </h2>
    <p className="text-slate-600 font-light">{subtitle}</p>
  </>
);

export const EmailDisplay = ({ email }: { email: string }) => (
  <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8 text-center">
    <p className="text-sm text-slate-600 mb-1">Verification sent to</p>
    <p className="text-lg font-semibold text-slate-900 break-all">{email}</p>
  </div>
);

export const VerificationSteps = ({ steps }: { steps: string[] }) => (
  <div className="space-y-6 mb-8">
    <div>
      <h3 className="font-semibold text-slate-900 mb-4">What's next:</h3>
      <ol className="space-y-3">
        {steps.map((step, idx) => (
          <li key={idx} className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-sm flex items-center justify-center font-semibold">
              {idx + 1}
            </span>
            <span className="text-slate-700">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  </div>
);

export const InfoBox = ({
  title,
  message,
  variant = "info",
}: {
  title: string;
  message: string;
  variant?: "info" | "warning";
}) => {
  const styles = {
    info: "bg-blue-50 border-blue-200",
    warning: "bg-amber-50 border-amber-200",
  };
  return (
    <div className={`${styles[variant]} border rounded-lg p-4`}>
      <p className="text-sm text-slate-700">
        <strong>{title}:</strong> {message}
      </p>
    </div>
  );
};

export const InfoBoxContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="space-y-4 mb-8">{children}</div>;

export const VerificationActionButton = ({
  text,
  href,
  LinkComponent,
}: {
  text: string;
  href: string;
  LinkComponent: React.ComponentType<{
    href: string;
    children: React.ReactNode;
    className?: string;
  }>;
}) => {
  const Link = LinkComponent;
  return (
    <Link
      href={href}
      className="block w-full py-3 px-4 bg-slate-900 text-white font-semibold rounded-lg text-center hover:bg-slate-800 transition-colors"
    >
      {text}
    </Link>
  );
};
