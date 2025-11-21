import { Label } from "@radix-ui/react-label";
import { FileText } from "lucide-react";
import React from "react";
import { Resume } from "@/api/models/resume";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type SelectResumeProps = {
  resumes: Resume[];
  isLoading: boolean;
  isError: boolean;
  selectedResume: string;
  setSelectedResume: (value: string) => void;
};

function SelectResume({
  resumes,
  isLoading,
  isError,
  selectedResume,
  setSelectedResume,
}: SelectResumeProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="resume-select" className="text-sm font-medium">
        Choose Resume *
      </Label>
      <Select
        value={selectedResume}
        onValueChange={setSelectedResume}
        required
        disabled={isLoading || isError || resumes.length === 0}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={
              isLoading
                ? "Loading resumes..."
                : isError
                  ? "Error loading resumes"
                  : "Select a resume to analyze"
            }
          />
        </SelectTrigger>
        {resumes.length > 0 ? (
          <SelectContent>
            {resumes.map((resume) => {
              const displayText = resume.name || "";
              const truncatedText =
                displayText.length > 26
                  ? displayText.slice(0, 22) + "..." + ".pdf"
                  : displayText;

              return (
                <SelectItem key={resume.id} value={resume.id || ""}>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span className="md:hidden">{truncatedText}</span>
                    <span className="hidden md:inline">{displayText}</span>
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

export default SelectResume;
