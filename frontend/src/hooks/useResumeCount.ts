import { useFetchResumes } from "@/app/(user)/Home/queries/resumeQuery";

export const useResumeCount = () => {
  const { data, isLoading, error } = useFetchResumes();

  return {
    resumeCount: data?.resumes?.length || 0,
    isLoading,
    isError: !!error,
  };
};
