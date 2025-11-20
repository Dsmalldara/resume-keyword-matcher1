import { usePostCoverlettersCreateLetters } from "@/api/generated/cover-letters/cover-letters";
import { queryKeys } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateCoverLetterMutation = () => {
  const queryClient = useQueryClient();
  return usePostCoverlettersCreateLetters({
    mutation: {
      onSuccess: (data) => {
        console.log("File upload finalized successfully", data);
        // Invalidate cover letters cache after successful creation
        queryClient.invalidateQueries({
          queryKey: [queryKeys.coverletters],
          exact: false,
          refetchType: "active",
        });
        queryClient.invalidateQueries({
          queryKey: [queryKeys.activity],
          exact: false,
          refetchType: "active",
        });
      },
      onError: (error) => {
        console.error("Error finalizing file upload", error);
      },
    },
  });
};
