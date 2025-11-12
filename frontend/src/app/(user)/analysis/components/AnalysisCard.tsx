"use client";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { FileText, User, Building, Calendar, Eye, Mail } from "lucide-react";
import { SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CircularProgress from "./CircularProgress";
import { useGetAllAnalysisQuery } from "../Queries/getAllAnalysisQuery";
import { GetAnalysisGetAnalysis200DataItem } from "@/api/models";
import { getStatusColor, StatusType } from "./StatusColor";
import AnalysisHighlight from "./AnalysisHighlight";

const AnalysisCards = ({
  setSelectedAnalysis,
  setIsDetailsOpen,
  analysisData
}: {
  setSelectedAnalysis: (analysis: SetStateAction<GetAnalysisGetAnalysis200DataItem | null>) => void;
  setIsDetailsOpen: (isOpen: boolean) => void;
  analysisData?: GetAnalysisGetAnalysis200DataItem[];
}) => {





const getMatchBadge = (score: number | undefined) => {
    if (score === undefined) return null;
    if (score >= 80) {
      return    ( 
          <Badge className={getStatusColor("Strong")}>
            Excellent Match
          </Badge>
         )


    } else if (score >= 50) {
      return <Badge className={getStatusColor("Good")}>Good Match</Badge>;
    } else {
      return <Badge className={getStatusColor("Weak")}>Weak Match</Badge>;
    }
  };
  return (
 <>
      {analysisData?.map((analysis) => (
        <Card key={analysis.id} className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <FileText className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                  <h3 className="font-semibold text-lg break-words">
                    {analysis.resumeName}
                  </h3>
                </div>
                <div className="space-y-1 pl-7">
                  <p className="font-medium flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    {analysis.jobTitle}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Building className="w-4 h-4 flex-shrink-0" />
                    {analysis.jobCompany}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    {analysis.createdAt && new Date(analysis.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              {analysis.matchScore !== undefined && (
                <CircularProgress score={analysis.matchScore} />
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
              
              {getMatchBadge(analysis.matchScore)}

            {/* Summary */}
            <div className="p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm leading-relaxed">
                {analysis.summary}
              </p>
            </div>
           

           {/* Highlights  Section*/}
            <AnalysisHighlight
              score={analysis.matchScore || 0}
              strengths={analysis.strengths}
              gaps={analysis.gaps}
            />
          </CardContent>

          <CardFooter className="flex gap-2 pt-4 border-t">
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
            <Button variant="outline" className="flex-1">
              <Mail className="w-4 h-4 mr-2" />
              Cover Letter
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default AnalysisCards;