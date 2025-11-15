import { getAnalysisGetAnalysis } from "@/api/generated/analysis/analysis";
import { GetAnalysisGetAnalysisParams } from "@/api/models";
import { queryKeys } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useGetAllAnalysisQuery = (
  param?: GetAnalysisGetAnalysisParams,
) => {
  const query = useQuery({
    queryKey: [queryKeys.analysis, param],
    queryFn: () => getAnalysisGetAnalysis(param),
    staleTime: 5 * 60 * 1000, // 5 minutes - matches global config
    retry: 1, // Use global retry config
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't force refetch on mount - respect cache
  });

  return query;
};
