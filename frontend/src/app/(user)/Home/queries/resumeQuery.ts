import { queryKeys } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getResumeListGetResume } from "@/api/generated/resume/resume";
import { GetResumeListGetResumeParams } from "@/api/models";
export const useFetchResumes = (params?: GetResumeListGetResumeParams ) => {
 return useQuery({
    queryKey: [queryKeys.resume, params],
    queryFn: () => getResumeListGetResume(params),
    enabled: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
})
}