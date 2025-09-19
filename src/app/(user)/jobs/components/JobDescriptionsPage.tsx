"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FileText } from "lucide-react";
import { JobDescriptionForm } from "./JobDescriptionForm";
import { JobDescriptionTable } from "./JobDescriptionTable";

import { useIsMobile } from "@/hooks/use-mobile";
import { JobDescriptionModal } from "./JobDescriptionModal";

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  dateAdded: string;
  status: "Pending Analysis" | "Ready";
  description: string;
}

export default function JobDescriptionsPage() {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleAddJobDescription = (jobData: Omit<JobDescription, "id">) => {
    const newJob: JobDescription = {
      ...jobData,
      id: Date.now().toString(),
    };
    setJobDescriptions((prev) => [newJob, ...prev]);
    setIsFormOpen(false);
  };

  const handleDeleteJob = (id: string) => {
    setJobDescriptions((prev) => prev.filter((job) => job.id !== id));
  };

  const handleViewJob = (job: JobDescription) => {
    setSelectedJob(job);
    setIsViewModalOpen(true);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Job Descriptions
          </h1>
          <p className="text-muted-foreground">
            Manage and analyze job descriptions for better application targeting
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Job Description
        </Button>
      </div>

      {/* Content */}
      {jobDescriptions.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16">
          <CardContent className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No job descriptions yet</h3>
              <p className="text-muted-foreground max-w-sm">
                Start by adding your first job description to analyze and track
                opportunities
              </p>
            </div>
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add your first job description
            </Button>
          </CardContent>
        </Card>
      ) : (
        <JobDescriptionTable
          jobDescriptions={jobDescriptions}
          onView={handleViewJob}
          onDelete={handleDeleteJob}
          isMobile={isMobile}
        />
      )}

      {/* Add Job Description Form */}
      <JobDescriptionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleAddJobDescription}
      />

      {/* View Job Description Modal */}
      <JobDescriptionModal
        job={selectedJob}
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
      />
    </div>
  );
}
