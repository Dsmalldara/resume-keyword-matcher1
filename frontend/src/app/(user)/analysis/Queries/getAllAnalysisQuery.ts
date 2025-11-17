import { getAnalysisGetAnalysis } from "@/api/generated/analysis/analysis";
import { GetAnalysisGetAnalysisParams } from "@/api/models";
import { queryKeys } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useGetAllAnalysisQuery = (
  param?: GetAnalysisGetAnalysisParams,
) => {
  const query = useQuery({
    queryKey: [queryKeys.analysis, param?.page ?? 1, param?.perPage ?? 10],
    queryFn: () => getAnalysisGetAnalysis(param),
  });

  return query;
};
