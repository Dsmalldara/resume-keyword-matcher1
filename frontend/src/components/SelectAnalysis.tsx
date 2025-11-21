import { Label } from "@radix-ui/react-label";
import { Building, FileText } from "lucide-react";
import React from "react";
import { Badge } from "./ui/badge";
import { GetAnalysisGetAnalysis200DataItem } from "@/api/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type SelectResumeProps = {
  analysis: GetAnalysisGetAnalysis200DataItem[];
  isLoading: boolean;
  isError: boolean;
  setSelectedAnalysis: (value: string) => void;
  selectedAnalysis: string;
};

function SelectAnalysis({
  analysis,
  isLoading,
  isError,
  selectedAnalysis,
  setSelectedAnalysis,
}: SelectResumeProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="resume-select" className="text-sm font-medium">
        Choose Analysis *
      </Label>
      <Select
        required
        disabled={isLoading || isError || analysis.length === 0}
        onValueChange={(value) => setSelectedAnalysis(value)}
        value={selectedAnalysis}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={
              isLoading
                ? "Loading analysis..."
                : isError
                  ? "Error loading analysis"
                  : "Select an analysis"
            }
          />
        </SelectTrigger>
        {analysis.length > 0 ? (
          <SelectContent>
            {analysis.map((analysis) => {
              const displayText = `${analysis.jobTitle} at ${analysis.jobCompany}`;
              const truncatedText =
                displayText.length > 26
                  ? displayText.slice(0, 25) + "..."
                  : displayText;

              return (
                <SelectItem key={analysis.id} value={analysis.id || ""}>
                  <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 flex-shrink-0" />
                      <span className="md:hidden">{truncatedText}</span>
                      <span className="hidden md:inline">{displayText}</span>
                    </div>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {analysis.matchScore}% match
                    </Badge>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        ) : (
          <SelectContent>
            <SelectItem value="no-resumes" disabled>
              No resumes available
            </SelectItem>
          </SelectContent>
        )}
      </Select>
    </div>
  );
}

export default SelectAnalysis;
