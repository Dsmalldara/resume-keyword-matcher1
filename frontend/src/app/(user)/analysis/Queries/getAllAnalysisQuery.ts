import { getAnalysisGetAnalysis } from "@/api/generated/analysis/analysis"; // Look for this
import { GetAnalysisGetAnalysisParams } from "@/api/models";
import { queryKeys } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useGetAllAnalysisQuery = (param:GetAnalysisGetAnalysisParams) => {
  const query = useQuery({
    queryKey: [queryKeys.analysis],
    queryFn: () => getAnalysisGetAnalysis(), 
    staleTime: 2 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  if (query.data) {
    console.log("Fetched analysis data:", query.data);
  }

  return query;
};