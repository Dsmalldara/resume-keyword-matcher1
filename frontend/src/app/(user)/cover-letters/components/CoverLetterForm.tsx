"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Mail, Building } from "lucide-react";
import { Resume } from "@/api/models/resume";
import { useFetchResumes } from "../../Home/queries/resumeQuery";
import SelectResume from "@/components/SelectResume";
import SelectAnalysis from "@/components/SelectAnalysis"
import { useGetAllAnalysisQuery } from "../../analysis/Queries/getAllAnalysisQuery";
import { Controller, useForm } from "react-hook-form";
import { createLetterValidation, CreateLetterValidationType } from "../validations/createLetterValidation";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useCreateCoverLetterMutation } from "../mutations/createCoverLetterMutation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import CoverLetterCreateButton from "./CoverLetterCreateButton";



const CoverLetterForm = ({ isOpen,onOpenChange,}: { isOpen: boolean; onOpenChange: (open: boolean) => void;}) => {
    const {data, isLoading } = useFetchResumes();
   const {
  register,
  handleSubmit,
  watch,
  control,
  formState: { errors }
} = useForm<CreateLetterValidationType>({ 
  resolver: zodResolver(createLetterValidation),
  defaultValues: {
    resumeId: "",
    analysisId: "",
    customNotes: ""
  },
  mode: "onChange" 
});
      
     const { data: analysisInfo, isLoading: isLoadingAnalysis,  } = useGetAllAnalysisQuery();
     const {mutate:createCoverLetter, isPending:isCreating, } = useCreateCoverLetterMutation()
     const analysis = analysisInfo?.data;
    const resumes: Resume[] = data?.resumes || []; 
 



 const onSubmit = (formData: CreateLetterValidationType)=>{
    createCoverLetter(
         {
      data: {
        resumeId: formData.resumeId,       
        analysisId: formData.analysisId,    
        customNotes: formData.customNotes,  
      },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast.success("Cover letter generated successfully!");
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
          onOpenChange(false);
        }
      }
   
    )
 }

  const selectedResumeId = watch("resumeId");
  const selectedAnalysisId = watch("analysisId");


  return (
    <Dialog open={isOpen}
      onOpenChange={(open) => {
        if (isCreating) return; 
        onOpenChange(open); }}>
    
      <DialogContent className="sm:max-w-[600px]">
       
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Generate Cover Letter
          </DialogTitle>
        </DialogHeader>
           <form onSubmit={(e) => {
      handleSubmit(onSubmit)(e);
    }}>
        <div className="space-y-6">
                  <Controller
              name="resumeId"
              control={control}
              render={({ field }) => (
                <>
                  <SelectResume
                    resumes={resumes}
                    isLoading={isLoading}
                    isError={false}
                    selectedResume={field.value}
                    setSelectedResume={field.onChange}
                  />
                  {errors.resumeId && (
                    <p className="text-red-500 text-sm">{errors.resumeId.message}</p>
                  )}
                </>
              )}
            />

            <Controller
              name="analysisId"
              control={control}
              render={({ field }) => (
                <>
                  <SelectAnalysis
                    analysis={analysis || []}
                    isLoading={isLoadingAnalysis}
                    isError={false}
                    selectedAnalysis={field.value}
                    setSelectedAnalysis={field.onChange}
                  />
                  {errors.analysisId && (
                    <p className="text-red-500 text-sm">{errors.analysisId.message}</p>
                  )}
                </>
              )}
            />

          <div className="space-y-2">
            <Label htmlFor="custom-notes" className="text-sm font-medium">
              Custom Notes (Optional)
            </Label>
            <Textarea
              id="custom-notes"
              placeholder="e.g., emphasize leadership skills, mention specific project experience, highlight remote work capabilities..."
             {...register("customNotes")}
              className="min-h-[80px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Add specific points you'd like to emphasize in your cover letter
            </p>
            <p className="text-red-500">{errors.customNotes?.message}</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
                        <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}  > Cancel
            </Button>


            <CoverLetterCreateButton 
              type="submit"
              isCreating={isCreating}
              selectedResumeId={selectedResumeId}
              selectedAnalysisId={selectedAnalysisId}
              className="min-w-[140px]"
            />
          
          </div>
        </div>
        </form>
      </DialogContent>
     
    </Dialog>
  );
};
export default CoverLetterForm;
