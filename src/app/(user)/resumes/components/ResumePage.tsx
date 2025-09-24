"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

import ResumeTable from "./ResumeTable";
import MobileResumeCards from "./MobileResumeCards";
import EmptyState from "./EmptyState";
import UploadResumeCard from "./UploadResumeCard";

export default function ResumePage() {
  const resumes = [
    { id: 1, name: "Resume1.pdf", date: "2024-01-15", status: "Analyzed" },
    { id: 2, name: "Resume2.docx", date: "2024-01-14", status: "Pending" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resumes</h1>
            <p className="text-muted-foreground mt-1 lg:w-[15rem]">
              Upload, analyze, and manage your resume documents
            </p>
          </div>
          <Button size="lg" className="sm:w-auto w-full">
            <Plus className="w-4 h-4 mr-2" />
            Upload Resume
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto">
          {/* Upload Section */}
          <div className="lg:col-span-4">
            <UploadResumeCard />
          </div>

          {/* Resume List Section */}
          <div className="lg:col-span-8">
            <Card>
              <CardContent className="p-6">
                {resumes.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold">
                        Your Resumes ({resumes.length})
                      </h2>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block">
                      <ResumeTable resumes={resumes} />
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden">
                      <MobileResumeCards resumes={resumes} />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
