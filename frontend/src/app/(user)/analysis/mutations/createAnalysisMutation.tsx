import { usePostAnalysisAnalyze } from "@/api/generated/analysis/analysis";
import { queryKeys } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateAnalysisMutation = () => {
  const queryClient = useQueryClient();
  return usePostAnalysisAnalyze({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [queryKeys.analysis],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: [queryKeys.insights],
          exact: false,
        });
      },
    },
  });
};
