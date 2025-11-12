"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

import ResumeTable from "./ResumeTable";
import MobileResumeCards from "./MobileResumeCards";
import UploadResumeCard from "./UploadResumeCard";
import FileUploader from "../../Home/components/FileUploader";
import { useFetchResumes } from "../../Home/queries/resumeQuery";
import { GetResumeListGetResumeParams, Resume } from "@/api/models";
import { useState } from "react";
import Pagination from "@/components/ui/pagination";
export default function ResumePage() {
  const [paginationState, setPaginationState] = useState<GetResumeListGetResumeParams>({
    page: 1,
    perPage: 10,
  });

  const { data, isLoading } = useFetchResumes(paginationState);
  const resumes: Resume[] = data?.resumes || [];
  const totalPages = data?.pagination?.totalPages ?? 1;
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
            <Card className="h-fit">
              <CardContent className="p-[1.6rem]">
                <FileUploader />
              </CardContent>
            </Card>
          </div>

          {/* Resume List Section */}
          <div className="lg:col-span-8">
            <Card>
              <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold">
                        Your Resumes ({resumes.length})
                      </h2>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block">
                      <ResumeTable resumes={resumes} isLoading={isLoading}/>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden">
                      <MobileResumeCards resumes={resumes} isLoading={isLoading}/>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4">
                      <Pagination
                        currentPage={paginationState.page ?? 1}
                        totalPages={totalPages}
                        onPageChange={(page) => setPaginationState((s) => ({ ...(s || {}), page }))}
                      />
                    </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
