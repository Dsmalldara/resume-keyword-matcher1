"use client";
import {Dialog,DialogContent,DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle, FileText,Target, XCircle,Briefcase,Calendar,TrendingUp, TrendingDown} from "lucide-react";
import { GetAnalysisGetAnalysis200DataItem } from "@/api/models";
import CircularProgress from "./CircularProgress";
import { Badge } from "@/components/ui/badge";

const AnalysisModal = ({
  analysis,
  isOpen,
  onOpenChange,
}: {
  analysis: GetAnalysisGetAnalysis200DataItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  if (!analysis) return null;

  const isGoodMatch = (analysis.matchScore ?? 0) >= 65;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[50rem] md:max-w-[50rem] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-6 h-6 text-primary" />
            Analysis Details
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              {analysis.jobTitle}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {analysis.createdAt && new Date(analysis.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Header Card with Score */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-xl p-6 border border-primary/20">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{analysis.resumeName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {analysis.jobCompany}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={isGoodMatch ? "default" : "secondary"}
                    className={isGoodMatch ? "bg-green-600" : "bg-amber-600"}
                  >
                    {isGoodMatch ? "Good Match" : "Needs Improvement"}
                  </Badge>
                  <Badge variant="outline">
                    {analysis.matchScore}% Match
                  </Badge>
                </div>
              </div>
              <CircularProgress score={analysis.matchScore ?? 0} size={80} />
            </div>
          </div>

          {/* Summary Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-base">Overall Assessment</h4>
            </div>
            <div className="bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
              <p className="text-sm leading-relaxed text-foreground">
                {analysis.summary}
              </p>
            </div>
          </div>

          {/* Strengths Section */}
          {analysis.strengths && analysis.strengths.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold text-base text-green-700 dark:text-green-400">
                  Key Strengths
                </h4>
                <Badge variant="secondary" className="ml-auto">
                  {analysis.strengths.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {analysis.strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-3 rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-900"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed text-foreground flex-1">
                      {strength}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gaps Section */}
          {analysis.gaps && analysis.gaps.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <h4 className="font-semibold text-base text-red-700 dark:text-red-400">
                  Areas for Improvement
                </h4>
                <Badge variant="secondary" className="ml-auto">
                  {analysis.gaps.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {analysis.gaps.map((gap, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-3 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900"
                  >
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed text-foreground flex-1">
                      {gap}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps Section */}
          {analysis.nextSteps && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <AlertCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-base text-purple-700 dark:text-purple-400">
                  Recommended Action Plan
                </h4>
              </div>
              <div className="bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
                <p className="text-sm leading-relaxed text-foreground">
                  {analysis.nextSteps}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisModal;