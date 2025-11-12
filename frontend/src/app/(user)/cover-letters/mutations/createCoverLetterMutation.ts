import { usePostCoverlettersCreateLetters } from "@/api/generated/cover-letters/cover-letters";
import { queryKeys } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";


export const useCreateCoverLetterMutation = () => {
    const queryClient = useQueryClient();
     return usePostCoverlettersCreateLetters({
        mutation: {
          onSuccess: (data) => {
            console.log("File upload finalized successfully", data);
            // refetch the activity query after successful finalize
            queryClient.refetchQueries({ queryKey: [queryKeys.coverletters] });
            
          },
          onError: (error) => {
            console.error("Error finalizing file upload", error);
          },
        },
      });
}
