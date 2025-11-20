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
    refetchOnMount: true,
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
  return useQuery({
    queryKey: [queryKeys.resume, params],
    queryFn: () => getResumeListGetResume(params),
    refetchOnMount: true,
  });
};
