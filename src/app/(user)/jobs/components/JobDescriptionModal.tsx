"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar } from "lucide-react";
import { format } from "@/lib/date-utils";
import type { JobDescription } from "./JobDescriptionsPage";

interface JobDescriptionModalProps {
  job: JobDescription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobDescriptionModal({
  job,
  open,
  onOpenChange,
}: JobDescriptionModalProps) {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-xl">{job.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-1 text-base">
                  <Building className="h-4 w-4" />
                  {job.company}
                </DialogDescription>
              </div>
              <Badge variant={job.status === "Ready" ? "default" : "secondary"}>
                {job.status}
              </Badge>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Added on {format(new Date(job.dateAdded), "MMMM d, yyyy")}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Job Description</h4>
            <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                {job.description}
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
