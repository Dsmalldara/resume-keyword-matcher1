"use client";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Target,
  XCircle,
} from "lucide-react";
import { CircularProgress } from "./AnalysisForm";
import { Analysis } from "./AnalysisTypes";

// Analysis Details Modal
const AnalysisModal = ({
  analysis,
  isOpen,
  onOpenChange,
}: {
  analysis: Analysis;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  console.log("AnalysisModal analysis prop:", analysis);
  if (!analysis) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] md:max-h-[100vh]  max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Analysis Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{analysis.resumeName}</h3>
              <CircularProgress score={analysis.matchScore} size={60} />
            </div>
            <p className="text-sm text-muted-foreground">
              {analysis.jobTitle} at {analysis.company}
            </p>
          </div>

          {/* Summary */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Analysis Summary
            </h4>
            <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              {analysis.summary}
            </p>
          </div>

          {/* Strengths */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              Strengths ({analysis.strengths.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.strengths.map((strength, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                >
                  {strength}
                </Badge>
              ))}
            </div>
          </div>

          {/* Gaps */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-700 dark:text-red-400">
              <XCircle className="w-4 h-4" />
              Missing Skills ({analysis.gaps.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.gaps.map((gap, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
                >
                  {gap}
                </Badge>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <AlertCircle className="w-4 h-4" />
              Recommended Next Steps
            </h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm">{analysis.nextSteps}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisModal;
