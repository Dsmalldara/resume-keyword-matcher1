import { getInsightsImprovementInsights } from "@/api/generated/analysis-insights/analysis-insights";
import { getInsightsJobsAnalyzed } from "@/api/generated/analysis-insights/analysis-insights";
import { getInsightsBestMatch } from "@/api/generated/analysis-insights/analysis-insights";
import { queryKeys } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useGetAverageImprovementInsights = () => {
  return useQuery({
    queryKey: [queryKeys.insights, queryKeys.analysis[1]],
    queryFn: () => getInsightsImprovementInsights(),
    refetchOnMount: true,
  });
};

export default useGetAverageImprovementInsights;

export const useGetBestMatchScore = () => {
  return useQuery({
    queryKey: [queryKeys.insights, queryKeys.analysis[0]],
    queryFn: () => getInsightsBestMatch(),
    refetchOnMount: true,
  });
};

export const useGetJobAnalysisInsights = () => {
  return useQuery({
    queryKey: [queryKeys.insights, queryKeys.analysis[2]],
    queryFn: () => getInsightsJobsAnalyzed(),
    refetchOnMount: true,
  });
};
