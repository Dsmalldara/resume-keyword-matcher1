import React from "react";
import { GoogleIcon } from "../components/icons/icons";

export const AuthHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen w-full bg-white flex items-center justify-center p-5">
    <div
      className="w-full max-w-lg bg-white border-4 border-black"
      style={{ boxShadow: "8px 8px 0px #000000" }}
    >
      {children}
    </div>
  </div>
);

export const AuthHeaderText = ({ headerText }: { headerText: string }) => (
  <h1
    className="text-3xl font-black tracking-tight text-center p-4 border-b-black border-b-4"
    style={{ fontFamily: "Arial Black, sans-serif" }}
  >
    {headerText}
  </h1>
);

export type AuthInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const AuthInput = ({ label, error, ...props }: AuthInputProps) => {
  return (
    <div>
      <label
        className="block text-sm font-bold uppercase tracking-wider mb-2"
        style={{ fontFamily: "Courier New, monospace" }}
      >
        {label}
      </label>
      <input
        className={`w-full px-4 py-3 border-4 text-lg focus:outline-none focus:ring-0 ${
          error ? "border-red-600 bg-red-50" : "border-black"
        }`}
        style={{
          boxShadow: error ? "4px 4px 0px #DC2626" : "4px 4px 0px #000000",
        }}
        {...props}
      />
      {error && (
        <div
          className="mt-2 p-3 bg-red-600 text-white border-3 border-red-800 text-sm font-bold"
          style={{ fontFamily: "Courier New, monospace" }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export const AuthContinueWithGoogle = ({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className="w-full py-5 px-8 bg-white text-black border-4 border-black font-black text-md md:text-lg uppercase tracking-wide hover:translate-x-1 hover:translate-y-1 transition-transform flex items-center justify-center gap-3"
      style={{
        boxShadow: "6px 6px 0px #000000",
        fontFamily: "Arial Black, sans-serif",
      }}
      {...props}
    >
      <GoogleIcon />
      Continue with Google
    </button>
  );
};

export const AuthRevertButton = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <button
      className="mt-2 text-sm font-bold text-gray-600 hover:text-black underline"
      style={{ fontFamily: "Courier New, monospace" }}
    >
      {children}
    </button>
  );
};
type ButtonType = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
} & { isLoading?: boolean };

export const AuthButton = ({
  text,
  isLoading = false,
  disabled,
  ...props
}: ButtonType) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className="w-full py-5 px-8 bg-yellow-400 text-black border-4 border-black font-black text-base md:text-lg uppercase tracking-wide hover:translate-x-1 hover:translate-y-1 transition-transform disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 relative"
      style={{
        boxShadow: "6px 6px 0px #000000",
        fontFamily: "Arial Black, sans-serif",
      }}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-3">
          <svg
            className="animate-spin h-6 w-6"
            style={{
              border: "3px solid #000000",
              borderTopColor: "transparent",
              borderRadius: "50%",
            }}
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-0"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>
          LOADING...
        </span>
      ) : (
        text
      )}
    </button>
  );
};

export const AuthDividerLine = () => {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t-4 border-black"></div>
      </div>
      <div className="relative flex justify-center">
        <span
          className="bg-white px-4 text-sm font-bold uppercase tracking-wider"
          style={{ fontFamily: "Courier New, monospace" }}
        >
          OR
        </span>
      </div>
    </div>
  );
};

export const AuthErrorBox = ({ message }: { message: string }) => {
  return (
    <div
      className="p-4 bg-red-600 text-white border-4 border-red-800 font-bold mb-6"
      style={{
        boxShadow: "4px 4px 0px #7F1D1D",
        fontFamily: "Courier New, monospace",
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <div className="font-black uppercase text-sm mb-1">ERROR</div>
          <div className="text-sm">{message}</div>
        </div>
      </div>
    </div>
  );
};
