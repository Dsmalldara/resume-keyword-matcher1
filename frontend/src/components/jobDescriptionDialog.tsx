"use client";

import { useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  JobDescriptionDataType,
  jobDescriptionValidation,
} from "@/app/(user)/analysis/validations/jobDescriptionValidation";
import { useForm } from "react-hook-form";
import { useJob } from "@/app/jobProvider";
import { JobDescriptionTextArea, JobInput } from "./jobDescriptionUtils";
import { ConfirmAlertDialog } from "./ConfirmAlertDialog";

interface JobDescriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function JobDescriptionDialog({
  open,
  onOpenChange,
}: JobDescriptionDialogProps) {
  const { updateJobData, jobData } = useJob();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const previousOpen = useRef(open);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<JobDescriptionDataType>({
    resolver: zodResolver(jobDescriptionValidation),
    defaultValues: {
      jobDescription: "",
      jobTitle: "",
      company: "",
    },
  });
  const onSave = (data: JobDescriptionDataType) => {
    updateJobData({
      jobDescription: data.jobDescription,
      jobTitle: data.jobTitle,
      company: data.company,
    });
    reset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowConfirmDialog(true);
    } else {
      reset();
      onOpenChange(false);
    }
  };

  const handleConfirmCancel = () => {
    reset();
    setShowConfirmDialog(false);
    onOpenChange(false);
    updateJobData({
      jobDescription: "",
      jobTitle: "",
      company: "",
    });
  };

  const handleDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // User is trying to close the dialog (ESC, backdrop click, etc.)
      handleCancel();
    } else {
      onOpenChange(isOpen);
    }
  };

  useEffect(() => {
    if (open && !previousOpen.current) {
      if (jobData?.jobDescription) {
        reset({
          jobDescription: jobData.jobDescription,
          jobTitle: jobData.jobTitle || "",
          company: jobData.company || "",
        });
      } else {
        reset({
          jobDescription: "",
          jobTitle: "",
          company: "",
        });
      }
    }
    previousOpen.current = open;
  }, [open, jobData, reset]);

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent
          className="sm:max-w-[600px] md:max-h-[100vh] max-h-[90vh] overflow-y-auto"
          onInteractOutside={(e) => {
            // Prevent closing on outside click
            e.preventDefault();
            handleCancel();
          }}
          onEscapeKeyDown={(e) => {
            // Prevent closing on ESC
            e.preventDefault();
            handleCancel();
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Add Job Description
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSave)}>
            <div className="space-y-6">
              <div className="space-y-2">
                <JobDescriptionTextArea
                  label="Job Description *"
                  {...register("jobDescription")}
                  onChange={() => jobData?.jobDescription}
                />
                <p className="text-red-500">{errors.jobDescription?.message}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <JobInput
                    label="Job Title (optional)"
                    {...register("jobTitle")}
                    onChange={() => jobData?.jobTitle}
                    id="job-title"
                    placeholder="e.g., Frontend Developer"
                  />
                  <p className="text-red-500">{errors.jobTitle?.message}</p>
                </div>
                <div className="space-y-2">
                  <JobInput
                    label="Company (optional)"
                    {...register("company")}
                    id="job-company"
                    placeholder="e.g., Tech Corp"
                  />

                  <p className="text-red-500">{errors.company?.message}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">Save Job Description</Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmAlertDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Discard changes?"
        description="You have unsaved changes. Are you sure you want to cancel? Your changes will be lost."
        confirmText="Discard Changes"
        cancelText="Continue Editing"
        confirmClassName="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
        onConfirm={handleConfirmCancel}
      />
    </>
  );
}
