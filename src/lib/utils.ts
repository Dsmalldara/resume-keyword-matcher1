import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: any): string => {
  const errorMessage =
    error?.response?.data?.error || // JSON error object
    error?.response?.data || // Plain text/HTML response
    error?.message || // Network errors
    "An error occurred";

  // Ensure we return a string
  return typeof errorMessage === "string"
    ? errorMessage
    : JSON.stringify(errorMessage);
};
