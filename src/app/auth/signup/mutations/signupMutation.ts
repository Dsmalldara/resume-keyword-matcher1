import { usePostAuthSignup } from "@/api/generated/authentication/authentication";

export const useSignUpMutation = () => {
  return usePostAuthSignup({
    mutation: {
      retry: 2,
      retryDelay: 1000,
    },
  });
};
