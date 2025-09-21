"use client";
import { Button } from "@/components/ui/button";
import CoverLetterForm from "./CoverLetterForm";
import { Plus } from "lucide-react";
import { useState } from "react";
import CoverLetterCard from "./CoverLetterCard";
import CoverLetterModal from "./CoverLetterModal";
import { mockCoverLetters } from "./mocks";
import CoverLetterEmptyState from "./CoverLetterEmpty";
import { coverLetterType } from "./types";

// Main Cover Letters Page Component
export default function CoverLettersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCoverLetter, setSelectedCoverLetter] =
    useState<coverLetterType | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleView = (coverLetter: coverLetterType) => {
    setSelectedCoverLetter(coverLetter);
    setIsViewOpen(true);
  };

  const handleDelete = (id: string) => {
    // Placeholder for delete functionality
    console.log("Delete cover letter:", id);
  };

  const handleGenerate = () => {
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cover Letters</h1>
            <p className="text-muted-foreground mt-1">
              Generate and manage personalized cover letters for your job
              applications
            </p>
          </div>
          <Button
            size="lg"
            onClick={handleGenerate}
            className="sm:w-auto w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Cover Letter
          </Button>
        </div>

        {/* Main Content */}
        {mockCoverLetters.length === 0 ? (
          <CoverLetterEmptyState onGenerate={handleGenerate} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockCoverLetters.map((coverLetter) => (
              <CoverLetterCard
                key={coverLetter.id}
                coverLetter={coverLetter}
                onView={handleView}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <CoverLetterForm isOpen={isFormOpen} onOpenChange={setIsFormOpen} />
        {selectedCoverLetter && (
          <CoverLetterModal
            coverLetter={selectedCoverLetter}
            isOpen={isViewOpen}
            onOpenChange={setIsViewOpen}
          />
        )}
      </div>
    </div>
  );
}
