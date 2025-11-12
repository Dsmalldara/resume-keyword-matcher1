import { useDeleteResumeDeleteResumeId, usePostResumeUploadPresign } from "@/api/generated/resume/resume";
import { usePostResumeUploadComplete,usePostResumeUploadFinalize,
} from "@/api/generated/resume/resume";
import { queryKeys } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export const useGetPreSignedUrlMutation = () => {
  return usePostResumeUploadPresign({
    mutation: {
      retry: 2,
      retryDelay: 100,
      onSuccess: (data) => {
        console.log("File uploaded successfully", data);
      },
      onError: (error) => {
        console.error("Error uploading file", error);
      },
    },
  });
};

export const useUploadCompleteMutation = () => {
  return usePostResumeUploadComplete({
    mutation: {
      retry: 1,
      retryDelay: 100,
      onError: (error) => {
        console.error("Error completing file upload", error);
      },
    },
  });
};

export const useUploadFinalizeMutation = () => {
  const queryClient = useQueryClient();

  return usePostResumeUploadFinalize({
    mutation: {
      retry: 2,
      retryDelay: 100,
      onSuccess: (data) => {
        console.log("File upload finalized successfully", data);
        queryClient.invalidateQueries({ queryKey: [queryKeys.activity] });
        queryClient.invalidateQueries({ queryKey: [queryKeys.resume] });
        
      },
      onError: (error) => {
        console.error("Error finalizing file upload", error);
      },
    },
  });
};



export const useDeleteResumeMutation = () => {
  const queryClient = useQueryClient();

  return useDeleteResumeDeleteResumeId({
    mutation: {
      onSuccess: () => {
        // Invalidate resume list
        queryClient.invalidateQueries({ queryKey: [queryKeys.resume] });
        
        // Refetch activity
        queryClient.invalidateQueries({ queryKey: [queryKeys.activity] });
        
      },
      onError: () => {
        console.error("Error deleting resume");
      },
    },
  });
};