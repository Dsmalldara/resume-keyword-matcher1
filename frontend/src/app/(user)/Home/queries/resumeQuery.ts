import { queryKeys } from "@/lib/utils";
import { useGetResumeListGetResume } from "@/api/generated/resume/resume";
import { GetResumeListGetResumeParams } from "@/api/models";

/**
 * Fetches all resumes without pagination
 * Used for dropdowns and selections across the app
 * Cache is shared and persisted indefinitely
 */
export const useFetchResumes = () => {
  const query = useGetResumeListGetResume(undefined, {
    query: {
      staleTime: 5 * 60 * 1000,
      gcTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  });

  return query;
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
