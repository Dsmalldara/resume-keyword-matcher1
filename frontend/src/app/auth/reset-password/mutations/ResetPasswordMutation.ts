import { usePostAuthForgotPassword } from "@/api/generated/authentication/authentication";
import { usePostAuthVerifyResetToken } from "@/api/generated/authentication/authentication";

export const useVerifyResetToken = () => {
  return usePostAuthVerifyResetToken({
    mutation: {
      retry: 2,
      retryDelay: 1000,
      onSuccess: (data) => {},
    },
  });
};
export const useCreateResetPassword = () => {
  return usePostAuthForgotPassword({
    mutation: {
      retry: 2,
      retryDelay: 1000,
      onSuccess: (data) => {
        console.log("Signup successful", data);
      },
      onError: (error) => {
        console.error("Signup failed", error);
      },
    },
  });
};
