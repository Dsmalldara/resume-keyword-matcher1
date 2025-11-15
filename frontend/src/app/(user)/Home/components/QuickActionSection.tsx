"use client";
import JobDescriptionDialog from "@/components/jobDescriptionDialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Plus, FileText, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useJob } from "@/app/jobProvider";
import { useCreateAnalysisMutation } from "../../analysis/mutations/createAnalysisMutation";
import { useFetchResumes } from "../queries/resumeQuery";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SelectResume from "@/components/SelectResume";
import { getErrorMessage } from "@/lib/utils";
interface QuickActionSectionProps {
  children: React.ReactNode;
}

function QuickActionSection({ children }: QuickActionSectionProps) {
  const { mutate: createAnalysis, isPending: isAnalyzing } =
    useCreateAnalysisMutation();
  const { data: resumesData, isLoading: isResumesLoading } = useFetchResumes();
  const resumes = resumesData?.resumes || [];

  const { jobData, updateJobData } = useJob();
  const [showDescriptionDialogue, setShowDescriptionDialogue] = useState(false);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState("");

  const handleRunAnalysis = () => {
    if (!jobData?.jobDescription) {
      toast.error("Please add a job description first");
      setShowDescriptionDialogue(true);
      return;
    }

    if (!resumes || resumes.length === 0) {
      toast.error("Please upload a resume first");
      return;
    }

    setShowAnalysisDialog(true);
  };

  const handleConfirmAnalysis = () => {
    if (!selectedResumeId) {
      toast.error("Please select a resume");
      return;
    }

    createAnalysis(
      {
        data: {
          resumeId: selectedResumeId,
          jobDescription: jobData?.jobDescription || "",
          jobTitle: jobData?.jobTitle || "",
          company: jobData?.company || "",
        },
      },
      {
        onSuccess: () => {
          toast.success("Analysis created successfully!");
          setShowAnalysisDialog(false);
          setSelectedResumeId("");
          updateJobData({ jobDescription: "", jobTitle: "", company: "" });
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
          console.error(error);
        },
      },
    );
  };

  return (
    <>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Get started with your next optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Resume Section */}
          {children}
          {jobData?.jobDescription ? (
            <Button
              variant="outline"
              className="w-full border-2 border-green-200 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 h-12 md:px-1"
              onClick={() => setShowDescriptionDialogue(true)}
            >
              <FileText className="w-4 h-4 mr-2 text-green-600" />
              Job Description Added ✓
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200 h-12"
              onClick={() => setShowDescriptionDialogue(true)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Add Job Description
            </Button>
          )}
          <JobDescriptionDialog
            onOpenChange={setShowDescriptionDialogue}
            open={showDescriptionDialogue}
          />

          <Button
            className="mx-auto flex justify-center w-full"
            size="lg"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
          >
            <Zap className="w-4 h-4 mr-2" />
            {isAnalyzing ? "Running Analysis..." : "Run Analysis"}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Confirmation Dialog */}
      <AlertDialog
        open={showAnalysisDialog}
        onOpenChange={setShowAnalysisDialog}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              Run Analysis
            </AlertDialogTitle>
            <AlertDialogDescription>
              Select a resume to analyze against the job description
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <SelectResume
              resumes={resumes}
              setSelectedResume={setSelectedResumeId}
              selectedResume={selectedResumeId}
              isLoading={isResumesLoading}
              isError={false}
            />
            {jobData?.jobTitle && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  <strong>Job:</strong> {jobData.jobTitle}
                  {jobData.company && ` at ${jobData.company}`}
                </p>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isAnalyzing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAnalysis}
              disabled={isAnalyzing || !selectedResumeId}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? "Analyzing..." : "Confirm & Analyze"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default QuickActionSection;
