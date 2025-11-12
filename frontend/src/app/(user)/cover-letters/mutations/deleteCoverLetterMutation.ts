import { useMutation } from "@tanstack/react-query";
import { customInstance } from "@/api/client";
import { queryKeys } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteCoverlettersDeleteId } from "@/api/generated/cover-letters/cover-letters";


export const useDeleteCoverLetter = () => {
  const queryClient = useQueryClient();

 return useDeleteCoverlettersDeleteId({
        mutation: {
      retry: 2,
      retryDelay: 1000,
      onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.coverletters] });
            queryClient.invalidateQueries({ queryKey: [queryKeys.activity] });
            
          },
    },
    
 })
};
