import React from "react";

/**
 * Editorial Auth Component Library
 * Magazine-inspired design system for authentication pages.
 * Drop-in replacements for the previous modern-auth template —
 * all exports and prop signatures preserved.
 */

const serif = { fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" };

/* ==================== Container & Layout ==================== */

export const AuthContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen w-full bg-[#f8f3ea] dark:bg-background text-foreground flex flex-col lg:flex-row">
    {children}
  </div>
);

export const AuthSidebar = ({ children }: { children: React.ReactNode }) => (
  <aside className="hidden lg:flex lg:w-[42%] xl:w-[40%] bg-[#1a1814] text-[#f3ebd9] flex-col p-12 xl:p-16 relative overflow-hidden">
    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-[#f3ebd9]/55 pb-6 border-b border-[#f3ebd9]/15">
      <span>Resume Matcher</span>
      <span>Vol. I · No. 04 · Spring 2026</span>
    </div>
    <div className="flex-1 flex flex-col justify-between pt-10">{children}</div>
  </aside>
);

export const AuthFormSection = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <main className="w-full lg:w-[58%] xl:w-[60%] flex flex-col items-center justify-center px-6 py-16 lg:py-20 min-h-screen lg:min-h-0">
    {children}
  </main>
);

export const AuthMobileHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div className="w-full max-w-md lg:hidden mb-10">
    <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/55 mb-4">
      Resume Matcher · Vol. I
    </p>
    <h1
      style={serif}
      className="text-5xl font-semibold leading-[0.95] tracking-tight"
    >
      {title}
    </h1>
    <p
      style={serif}
      className="text-lg italic text-foreground/70 mt-3 leading-snug"
    >
      {subtitle}
    </p>
  </div>
);

export const AuthFormContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="w-full max-w-md">{children}</div>;

/* ==================== Typography & Headers ==================== */

export const AuthBrandHeader = ({ title }: { title: string }) => (
  <div className="mb-12">
    <p className="text-[10px] uppercase tracking-[0.32em] text-[#f3ebd9]/55 mb-5">
      Cover Feature
    </p>
    <h1
      style={serif}
      className="text-5xl xl:text-6xl font-semibold leading-[0.95] tracking-tight"
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
    <div className="h-px w-12 bg-foreground mb-7" />
    <h2
      style={serif}
      className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[0.95] tracking-tight"
    >
      {title}
    </h2>
    <p className="text-foreground/65 mt-5 text-base leading-[1.7] max-w-sm">
      {subtitle}
    </p>
  </div>
);

/* ==================== Value Propositions ==================== */

export const ValuePropSection = ({
  items,
}: {
  items: Array<{ title: string; description: string }>;
}) => (
  <ol className="divide-y divide-[#f3ebd9]/15 border-y border-[#f3ebd9]/15">
    {items.map((item, idx) => (
      <li key={idx} className="py-6 flex items-baseline gap-5">
        <span
          style={serif}
          className="text-xl text-[#f3ebd9]/40 w-10 shrink-0 tabular-nums"
        >
          {String(idx + 1).padStart(2, "0")}
        </span>
        <div className="flex-1">
          <h3
            style={serif}
            className="text-2xl xl:text-3xl font-medium leading-tight text-[#f3ebd9]"
          >
            {item.title}
          </h3>
          <p className="text-sm text-[#f3ebd9]/70 mt-2 leading-[1.65]">
            {item.description}
          </p>
        </div>
      </li>
    ))}
  </ol>
);

export const SidebarFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="pt-10 mt-10 border-t border-[#f3ebd9]/15">
    <p
      style={serif}
      className="text-lg xl:text-xl italic text-[#f3ebd9]/75 leading-snug"
    >
      {children}
    </p>
  </div>
);

/* ==================== Form Inputs ==================== */

export type AuthInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const AuthInput = ({ label, error, ...props }: AuthInputProps) => (
  <div>
    <label className="block text-[10px] uppercase tracking-[0.28em] text-foreground/70 mb-3">
      {label}
    </label>
    <input
      className={`w-full px-0 py-3 bg-transparent border-0 border-b text-base focus:outline-none focus:ring-0 transition-colors placeholder:text-foreground/35 ${
        error
          ? "border-destructive/70 focus:border-destructive"
          : "border-foreground/25 focus:border-foreground"
      }`}
      {...props}
    />
    {error && (
      <p
        style={serif}
        className="mt-2 text-sm italic text-destructive"
      >
        {error}
      </p>
    )}
  </div>
);

export const PasswordInput = ({
  label,
  error,
  showPassword,
  onTogglePassword,
  ...props
}: AuthInputProps & {
  showPassword: boolean;
  onTogglePassword: () => void;
}) => (
  <div>
    <label className="block text-[10px] uppercase tracking-[0.28em] text-foreground/70 mb-3">
      {label}
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        className={`w-full px-0 py-3 pr-16 bg-transparent border-0 border-b text-base focus:outline-none focus:ring-0 transition-colors placeholder:text-foreground/35 ${
          error
            ? "border-destructive/70 focus:border-destructive"
            : "border-foreground/25 focus:border-foreground"
        }`}
        {...props}
      />
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute right-0 top-3 text-[10px] uppercase tracking-[0.28em] text-foreground/55 hover:text-foreground transition-colors"
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
    {error && (
      <p
        style={serif}
        className="mt-2 text-sm italic text-destructive"
      >
        {error}
      </p>
    )}
  </div>
);

export const TermsDisclaimer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <p className="text-[11px] text-foreground/55 leading-relaxed">{children}</p>
);

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
    className="w-full py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.28em] rounded-none hover:bg-foreground/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-10"
    {...props}
  >
    {isLoading ? "Working…" : text}
  </button>
);

export const GoogleAuthButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className="w-full py-4 border border-foreground/25 text-foreground text-[10px] uppercase tracking-[0.28em] rounded-none hover:border-foreground hover:bg-foreground/3 transition-colors flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
    {...props}
  >
    {children}
  </button>
));
GoogleAuthButton.displayName = "GoogleAuthButton";

/* ==================== Dividers & Separators ==================== */

export const AuthDivider = () => (
  <div className="flex items-center gap-4 my-10">
    <div className="flex-1 h-px bg-foreground/20" />
    <span className="text-[10px] uppercase tracking-[0.32em] text-foreground/55">
      Or
    </span>
    <div className="flex-1 h-px bg-foreground/20" />
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
    <p className="text-center text-sm text-foreground/65 mt-10">
      {text}
      <Link
        href={href}
        className="ml-2 text-foreground underline underline-offset-4 decoration-foreground/40 hover:decoration-foreground"
      >
        <span style={serif} className="italic font-medium text-base">
          {linkText}
        </span>
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
      <div className="mb-8 flex justify-center">
        <div className="h-px w-16 bg-foreground" />
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
    <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/55 mb-5">
      Awaiting confirmation
    </p>
    <h2
      style={serif}
      className="text-4xl md:text-5xl font-medium leading-none tracking-tight mb-5"
    >
      {title}
    </h2>
    <p className="text-foreground/65 leading-[1.7]">{subtitle}</p>
  </>
);

export const EmailDisplay = ({ email }: { email: string }) => (
  <div className="border-y border-foreground/15 py-6 mb-10">
    <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/55 mb-2">
      Verification sent to
    </p>
    <p
      style={serif}
      className="text-2xl md:text-3xl italic font-medium break-all"
    >
      {email}
    </p>
  </div>
);

export const VerificationSteps = ({ steps }: { steps: string[] }) => (
  <div className="mb-10 text-left">
    <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/55 mb-5">
      What&rsquo;s next
    </p>
    <ol className="divide-y divide-foreground/15 border-y border-foreground/15">
      {steps.map((step, idx) => (
        <li key={idx} className="py-4 flex items-baseline gap-5">
          <span
            style={serif}
            className="text-xl text-foreground/40 w-8 shrink-0 tabular-nums"
          >
            {String(idx + 1).padStart(2, "0")}
          </span>
          <span className="text-sm leading-[1.65] flex-1 text-foreground/80">
            {step}
          </span>
        </li>
      ))}
    </ol>
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
  const accent =
    variant === "warning"
      ? "text-amber-700 dark:text-amber-400"
      : "text-primary";
  return (
    <div className="border border-foreground/15 px-4 py-3.5 text-left bg-background/60">
      <p className="text-sm text-foreground/80 leading-[1.65]">
        <strong
          className={`italic font-medium mr-1 ${accent}`}
          style={serif}
        >
          {title}:
        </strong>
        {message}
      </p>
    </div>
  );
};

export const InfoBoxContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="space-y-3 mb-10 text-left">{children}</div>;

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
      className="block w-full py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.28em] text-center hover:bg-foreground/90 transition-colors"
    >
      {text}
    </Link>
  );
};
