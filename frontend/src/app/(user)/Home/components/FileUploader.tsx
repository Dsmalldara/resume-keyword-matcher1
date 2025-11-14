"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  File,
  X,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeExistsDialog } from "@/components/ResumeExistsDialog";
import { toast } from "sonner";
import {
  useGetPreSignedUrlMutation,
  useUploadCompleteMutation,
  useUploadFinalizeMutation,
} from "../mutations/resumeMutation";
import { getAccessToken } from "@/api/client";
import { getErrorMessage } from "@/lib/utils";
import { forwardRef } from "react";
const FileUploader = forwardRef<HTMLDivElement>((props, ref) => {
  const [file, setFile] = useState<File | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const [resumeExists, setResumeExists] = useState<boolean>(false);
  const [showResumeExistsDialog, setShowResumeExistsDialog] =
    useState<boolean>(false);
  const [uploadState, setUploadState] = useState<
    "idle" | "getting-url" | "ready" | "uploading" | "success" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { mutate: getPreSignedUrl } = useGetPreSignedUrlMutation();
  const { mutate: uploadComplete } = useUploadCompleteMutation();
  const { mutate: uploadFinalize } = useUploadFinalizeMutation();
  const access_token = getAccessToken();

  // Validate file
  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF and DOC files are allowed");
      return false;
    }

    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return false;
    }

    return true;
  };

  // Handle file drop/select
  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setSelectedFile(selectedFile);
    if (!selectedFile) return;

    if (!validateFile(selectedFile)) {
      return;
    }

    if (!access_token) {
      toast.error("Please login to upload files");
      return;
    }

    setFile(selectedFile);
    setUploadState("getting-url");

    // Get presigned URL
    getPreSignedUrl(
      {
        data: {
          filename: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          access_token: access_token,
        },
      },
      {
        onSuccess: (data) => {
          setSignedUrl(data.uploadUrl || null); // Adjust based on your API response
          setFinalUrl(data.filepath || null); // Adjust based on your API response
          setUploadState("ready");

          toast.success("File ready to upload!");
        },
        onError: (error) => {
          setUploadState("error");
          toast.error("Failed to prepare file upload");
        },
      },
    );
  };

  // Upload to Supabase bucket
  const handleUploadToSupabase = async () => {
    if (!file || !signedUrl || !selectedFile) {
      return;
    }
    setUploadState("uploading");
    setUploadProgress(0);

    try {
      // STEP 1: Validate with backend first
      uploadComplete(
        {
          data: {
            filename: file.name,
            filepath: finalUrl || "",
            size: selectedFile.size,
          },
        },
        {
          onSuccess: async (data) => {
            setUploadProgress(30);

            // STEP 2: Upload to Supabase ONLY if validation succeeded
            try {
              const interval = setInterval(() => {
                setUploadProgress((prev) => {
                  if (prev >= 90) {
                    clearInterval(interval);
                    return prev;
                  }
                  return prev + 10;
                });
              }, 100);

              const response = await fetch(signedUrl, {
                method: "PUT",
                body: file,
                headers: {
                  "Content-Type": file.type,
                },
              });
              clearInterval(interval);

              if (response.ok) {
                setUploadProgress(100);
                setUploadState("success");
                toast.success("Resume uploaded successfully!");
                uploadFinalize({
                  data: {
                    filename: file.name,
                    filepath: finalUrl || "",
                    size: selectedFile.size,
                  },
                });
              } else {
                const errorText = await response.text();
                setUploadState("error");
                toast.error(`Upload failed: ${response.statusText}`);
              }
            } catch (uploadError) {
              setUploadState("error");
              toast.error("Upload to storage failed.");
            }
          },
          onError: (error) => {
            getErrorMessage(error);
            setUploadState("error");
            toast.error(getErrorMessage(error));
            // Don't upload to Supabase if validation fails
          },
        },
      );
    } catch (error) {
      setUploadState("error");
      toast.error("Upload failed. Please check your connection.");
    }
  };

  // Remove/reset file
  const handleRemoveFile = () => {
    setFile(null);
    setSignedUrl(null);
    setFinalUrl(null);
    setUploadState("idle");
    setUploadProgress(0);
  };

  // Upload another file
  const handleUploadAnother = () => {
    handleRemoveFile();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    multiple: false,
    disabled: uploadState !== "idle",
  });

  const fileSizeInMb = file ? (file.size / (1024 * 1024)).toFixed(2) : null;

  return (
    <div ref={ref}>
      <ResumeExistsDialog
        open={resumeExists}
        onOpenChange={setResumeExists}
        fileName={file?.name || ""}
        onConfirm={() => {
          setResumeExists(false);
          handleUploadToSupabase();
        }}
      />
      {uploadState === "success" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900">{file?.name}</p>
              <p className="text-xs text-green-600">
                Successfully uploaded • {fileSizeInMb} MB
              </p>
            </div>
          </div>
          <Button
            onClick={handleUploadAnother}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Another Resume
          </Button>
        </div>
      )}

      {uploadState === "ready" && file && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <File className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {fileSizeInMb} MB • {file.type.split("/")[1].toUpperCase()}
              </p>
            </div>
            <button
              onClick={handleRemoveFile}
              className="flex-shrink-0 text-blue-600 hover:text-blue-800 transition-colors"
              aria-label="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <Button
            onClick={() => {
              handleUploadToSupabase();
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 h-12"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload to Cloud
          </Button>
        </div>
      )}

      {uploadState === "uploading" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">{file?.name}</p>
              <p className="text-xs text-blue-600">
                Uploading... {uploadProgress}%
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {uploadState === "getting-url" && (
        <div className="flex items-center justify-center gap-3 p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-600">Processing file...</p>
        </div>
      )}

      {uploadState === "error" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-900">
              Upload failed. Please try again.
            </p>
          </div>
          <Button
            onClick={handleRemoveFile}
            variant="outline"
            className="w-full"
          >
            Try Again
          </Button>
        </div>
      )}

      {uploadState === "idle" && (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${
              isDragActive
                ? "border-blue-500 bg-blue-50 scale-[1.02]"
                : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50"
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div
              className={`
              p-3 rounded-full transition-colors
              ${isDragActive ? "bg-blue-100" : "bg-gray-200"}
            `}
            >
              <Upload
                className={`w-6 h-6 ${isDragActive ? "text-blue-600" : "text-gray-600"}`}
              />
            </div>

            {isDragActive ? (
              <p className="text-sm font-medium text-blue-600">
                Drop your resume here
              </p>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-700">
                  Drag & drop your resume here
                </p>
                <p className="text-xs text-gray-500">or click to browse</p>
              </>
            )}

            <p className="text-xs text-gray-400 mt-2">
              Supports PDF, DOC, DOCX • Max 5MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

FileUploader.displayName = "FileUploader";

export default FileUploader;
