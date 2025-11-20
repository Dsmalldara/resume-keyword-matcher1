import { getActivityRecent } from "@/api/generated/activity/activity";
import { useQuery } from "@tanstack/react-query";
import { GetActivityByTypeTypeParams } from "@/api/models";
import { queryKeys } from "@/lib/utils";
export const useRecentActivity = (
  params: GetActivityByTypeTypeParams = {},
  queryOptions: {
    enabled?: boolean;
    refetchInterval?: number;
  } = {},
) => {
  const { limit = 10 } = params;

  const { enabled = true, refetchInterval } = queryOptions;

  return useQuery({
    queryKey: [queryKeys.activity, { limit }],
    queryFn: () => getActivityRecent({ limit }),
    enabled,
    refetchInterval,
    refetchOnMount: true,
  });
};
