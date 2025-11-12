import { getActivityRecent } from "@/api/generated/activity/activity";
import { useQuery } from "@tanstack/react-query";
import { GetActivityByTypeTypeParams } from "@/api/models";
import { queryKeys } from "@/lib/utils";
export const useRecentActivity = (
  params: GetActivityByTypeTypeParams = {},
  queryOptions: { enabled?: boolean; staleTime?: number; refetchInterval?: number } = {}
) => {
  const {
    limit = 10,
  } = params;

  const {
    enabled = true,
    staleTime = 2 * 60 * 1000, // 2 minutes for activity feed
    refetchInterval,
  } = queryOptions;

  return useQuery({
    queryKey: [queryKeys.activity,{limit}],
    queryFn: () => getActivityRecent({ limit }),
    enabled,
    staleTime,
    refetchInterval,
    gcTime: 10 * 60 * 1000, // Cache for 10 minutes (renamed from cacheTime in v5)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};