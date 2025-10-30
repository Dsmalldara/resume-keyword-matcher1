"use client";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  FileText,
  User,
  Building,
  Calendar,
  ChevronUp,
  ChevronDown,
  Eye,
  Mail,
} from "lucide-react";
import { SetStateAction, useState } from "react";
import { CircularProgress } from "./AnalysisForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnalysisResult } from "./AnalysisTypes";

const AnalysisCard = ({
  analysis,
  setSelectedAnalysis,
  setIsDetailsOpen,
}: {
  analysis: AnalysisResult;
  setSelectedAnalysis: (
    analysis: SetStateAction<AnalysisResult | null>,
  ) => void;
  setIsDetailsOpen: (isOpen: boolean) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  type StatusType = "Strong" | "Moderate" | "Weak";

  const getStatusColor = (status: StatusType): string => {
    switch (status) {
      case "Strong":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "Moderate":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Weak":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Button
              variant="link"
              className="p-0 h-auto font-semibold text-left justify-start"
            >
              <FileText className="w-4 h-4 mr-2" />
              {analysis.resumeName}
            </Button>
            <div className="space-y-1">
              <p className="font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                {analysis.jobTitle}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Building className="w-4 h-4" />
                {analysis.company}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(analysis.dateAnalyzed).toLocaleDateString()}
              </p>
            </div>
          </div>
          <CircularProgress score={analysis.matchScore} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge className={getStatusColor(analysis.status)}>
            {analysis.status} Match
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {analysis.summary}
        </p>

        {/* Expandable Details */}
        <div className="pt-2">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full justify-between p-2 h-auto"
          >
            <span className="text-sm font-medium">Quick Overview</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>

          {isExpanded && (
            <div className="mt-3 space-y-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div>
                <h5 className="text-xs font-medium text-green-700 dark:text-green-400 mb-2">
                  Top Strengths
                </h5>
                <div className="flex flex-wrap gap-1">
                  {analysis.strengths.slice(0, 3).map((strength, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    >
                      {strength}
                    </Badge>
                  ))}
                  {analysis.strengths.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{analysis.strengths.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h5 className="text-xs font-medium text-red-700 dark:text-red-400 mb-2">
                  Key Gaps
                </h5>
                <div className="flex flex-wrap gap-1">
                  {analysis.gaps.slice(0, 3).map((gap, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
                    >
                      {gap}
                    </Badge>
                  ))}
                  {analysis.gaps.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{analysis.gaps.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            setSelectedAnalysis(analysis);
            setIsDetailsOpen(true);
          }}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
        <Button variant="outline">
          <Mail className="w-4 h-4 mr-2" />
          Cover Letter
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnalysisCard;
