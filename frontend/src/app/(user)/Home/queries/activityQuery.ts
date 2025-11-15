import { getActivityRecent } from "@/api/generated/activity/activity";
import { useQuery } from "@tanstack/react-query";
import { GetActivityByTypeTypeParams } from "@/api/models";
import { queryKeys } from "@/lib/utils";
export const useRecentActivity = (
  params: GetActivityByTypeTypeParams = {},
  queryOptions: {
    enabled?: boolean;
    staleTime?: number;
    refetchInterval?: number;
  } = {},
) => {
  const { limit = 10 } = params;

  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes - matches global config
    refetchInterval,
  } = queryOptions;

  return useQuery({
    queryKey: [queryKeys.activity, { limit }],
    queryFn: () => getActivityRecent({ limit }),
    enabled,
    staleTime,
    refetchInterval,
    gcTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: 1, // Use global retry config
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};
