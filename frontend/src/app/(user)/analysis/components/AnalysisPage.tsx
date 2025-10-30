"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import AnalysisCard from "./AnalysisCard";
import { AnalysisForm } from "./AnalysisForm";
import AnalysisModal from "./AnalysisModal";
import { AnalysisEmptyState } from "./AnalysisEmptyState";
import { mockAnalyses } from "./mocks";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "./AnalysisTypes";

export default function AnalysisPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] =
    useState<AnalysisResult | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  console.log("Selected Analysis:", selectedAnalysis);
  const handleRunAnalysis = () => {
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analysis</h1>
            <p className="text-muted-foreground mt-1">
              Compare your resumes against job descriptions and get optimization
              insights
            </p>
          </div>
          <Button
            size="lg"
            onClick={handleRunAnalysis}
            className="sm:w-auto w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Run Analysis
          </Button>
        </div>

        {/* Main Content */}
        {mockAnalyses.length === 0 ? (
          <AnalysisEmptyState onRunAnalysis={handleRunAnalysis} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockAnalyses.map((analysis) => (
              <AnalysisCard
                key={analysis.id}
                analysis={analysis}
                setSelectedAnalysis={(analysis) =>
                  setSelectedAnalysis(analysis)
                }
                setIsDetailsOpen={setIsDetailsOpen}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <AnalysisForm isOpen={isFormOpen} onOpenChange={setIsFormOpen} />
        {selectedAnalysis && (
          <AnalysisModal
            analysis={selectedAnalysis}
            isOpen={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
          />
        )}
      </div>
    </div>
  );
}
