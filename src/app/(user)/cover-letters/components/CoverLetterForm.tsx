"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Mail, Building } from "lucide-react";
import { mockAnalyses } from "./mocks";

// Mock data
const mockResumes = [
  { id: 1, name: "John_Doe_Resume.pdf" },
  { id: 2, name: "Senior_Developer_Resume.docx" },
  { id: 3, name: "Marketing_Resume_2024.pdf" },
];

// Cover Letter Form Component
const CoverLetterForm = ({ isOpen, onOpenChange }) => {
  const [selectedResume, setSelectedResume] = useState("");
  const [selectedAnalysis, setSelectedAnalysis] = useState("");
  const [customNotes, setCustomNotes] = useState("");

  const handleSubmit = () => {
    // Placeholder for form submission
    console.log({ selectedResume, selectedAnalysis, customNotes });
    onOpenChange(false);
    // Reset form
    setSelectedResume("");
    setSelectedAnalysis("");
    setCustomNotes("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Generate Cover Letter
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resume-select" className="text-sm font-medium">
              Choose Resume *
            </Label>
            <Select
              value={selectedResume}
              onValueChange={setSelectedResume}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a resume" />
              </SelectTrigger>
              <SelectContent>
                {mockResumes.map((resume) => (
                  <SelectItem key={resume.id} value={resume.name}>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {resume.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="analysis-select" className="text-sm font-medium">
              Choose Job Analysis *
            </Label>
            <Select
              value={selectedAnalysis}
              onValueChange={setSelectedAnalysis}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a job analysis" />
              </SelectTrigger>
              <SelectContent>
                {mockAnalyses.map((analysis) => (
                  <SelectItem
                    key={analysis.id}
                    value={`${analysis.jobTitle}-${analysis.company}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        <span>
                          {analysis.jobTitle} at {analysis.company}
                        </span>
                      </div>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {analysis.matchScore}% match
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-notes" className="text-sm font-medium">
              Custom Notes (Optional)
            </Label>
            <Textarea
              id="custom-notes"
              placeholder="e.g., emphasize leadership skills, mention specific project experience, highlight remote work capabilities..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Add specific points you'd like to emphasize in your cover letter
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedResume || !selectedAnalysis}
              className="min-w-[140px]"
            >
              <Mail className="w-4 h-4 mr-2" />
              Generate Letter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default CoverLetterForm;
