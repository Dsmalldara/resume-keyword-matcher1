import { queryKeys } from "@/lib/utils";
import { useGetResumeListGetResume } from "@/api/generated/resume/resume";
import { GetResumeListGetResumeParams } from "@/api/models";
import { useQuery } from "@tanstack/react-query";
import { getResumeListGetResume } from "@/api/generated/resume/resume";
/**
 * Fetches all resumes without pagination
 * Used for dropdowns and selections across the app
 * Cache is shared and persisted indefinitely
 */
export const useFetchResumes = () => {
  return useQuery({
    queryKey: [queryKeys.resume, "all"],
    queryFn: () => getResumeListGetResume({ perPage: 1000 }),
  });
};

/**
 * Fetches resumes with pagination
 * Each page creates a separate cache entry
 * Use this ONLY in ResumePage for pagination
 */
export const useFetchResumesPaginated = (
  params?: GetResumeListGetResumeParams,
) => {
  const query = useGetResumeListGetResume(params, {
    query: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  });

  return query;
};
