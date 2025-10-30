import { usePostResumeUploadPresign } from "@/api/generated/resume/resume";
import {
  usePostResumeUploadComplete,
  usePostResumeUploadFinalize,
} from "@/api/generated/resume/resume";
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
      onSuccess: (data) => {
        console.log("File upload completed successfully", data);
      },
      onError: (error) => {
        console.error("Error completing file upload", error);
      },
    },
  });
};

export const useUploadFinalizeMutation = () => {
  return usePostResumeUploadFinalize({
    mutation: {
      retry: 2,
      retryDelay: 100,
      onSuccess: (data) => {
        console.log("File upload finalized successfully", data);
      },
      onError: (error) => {
        console.error("Error finalizing file upload", error);
      },
    },
  });
};
