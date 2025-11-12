"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog,DialogContent,DialogHeader,DialogTitle,} from "@/components/ui/dialog";
import { FileText, TrendingUp } from "lucide-react";
import { Resume } from "@/api/models/resume";
import { useFetchResumes } from "../../Home/queries/resumeQuery";
import SelectResume from "@/components/SelectResume";
import { JobDescriptionDataType, jobDescriptionValidation } from "../validations/jobDescriptionValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateAnalysisMutation } from "../mutations/createAnalysisMutation";
import { JobDescriptionTextArea, JobInput } from "@/components/jobDescriptionUtils";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import IsAnalyzingButton from "./IsAnalyzingButton";

// Analysis Form Component
const AnalysisForm = ({ isOpen, onOpenChange}: {isOpen: boolean; onOpenChange: (open: boolean) => void;}) => {
  const [selectedResumeId, setSelectedResumeId] = useState("");
    const {
      register, handleSubmit,reset, formState: { errors }} = useForm<JobDescriptionDataType>({ resolver: zodResolver(jobDescriptionValidation) });
     const {mutate:createAnalysis, isPending: isAnalyzing} = useCreateAnalysisMutation()
      const onSubmit = (data: JobDescriptionDataType) => {
        createAnalysis(
          {
            data: {
              resumeId: selectedResumeId,
              jobDescription: data.jobDescription,
              jobTitle: data.jobTitle,
              company: data.company,
            }
          },
          {
            onSuccess: (response) => {
             toast.success("Analysis created successfully!");
              onOpenChange(false);
              reset(
                {jobDescription: "", jobTitle: "", company: ""}
              )
            },
            onError: (error) => {
              toast.error(getErrorMessage(error));
              onOpenChange(false);
            },
          },
        );
      };

  
  const {data, isLoading } = useFetchResumes();
  console.log("Fetched resumes data:", data);
  const resumes: Resume[] = data?.resumes || [];
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-h-[100vh] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Run New Analysis
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <SelectResume
            resumes={resumes}
            setSelectedResume={setSelectedResumeId}
            selectedResume={selectedResumeId}
            isLoading={isLoading}
            isError={false}
          />
          <div className="space-y-2">
            <JobDescriptionTextArea
              label="Job Description (optional)*"
              {...register("jobDescription")}
              placeholder="Enter Job Description"
            />
            <p className="text-red-500">{errors.jobDescription?.message}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <JobInput
                label="Job Title (optional)"
                {...register("jobTitle")}
                placeholder="Enter Job Title"
              />
              <p className="text-red-500">{errors.jobTitle?.message}</p>
            </div>
            <div className="space-y-2">
              <JobInput
                label="Company (optional)"
                {...register("company")}
                placeholder="Enter Company Name"
              />
              <p className="text-red-500">{errors.company?.message}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isAnalyzing}
            >
              Cancel
            </Button>
             <IsAnalyzingButton
              isAnalyzing={isAnalyzing}
              selectedResumeId={selectedResumeId}
              disabled={isAnalyzing || !selectedResumeId}

            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisForm;
