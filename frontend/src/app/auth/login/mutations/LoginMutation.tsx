import { usePostAuthLogin } from "@/api/generated/authentication/authentication";

export const useLoginMutation = () => {
  return usePostAuthLogin({
    mutation: {
      retry: 2,
      retryDelay: 1000,
    },
  });
};
