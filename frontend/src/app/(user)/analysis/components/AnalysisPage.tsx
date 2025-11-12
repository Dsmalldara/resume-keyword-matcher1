"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import AnalysisCards from "./AnalysisCard";
import AnalysisForm from "./AnalysisForm";
import AnalysisModal from "./AnalysisModal";
import { AnalysisEmptyState } from "./AnalysisEmptyState";
import { Button } from "@/components/ui/button";
import { GetAnalysisGetAnalysis200DataItem } from "@/api/models";
import { useGetAllAnalysisQuery } from "../Queries/getAllAnalysisQuery";
import { AnalysisCardSkeleton } from "./AnalysisCardSkeleton";
import Pagination from "@/components/ui/pagination";

export default function AnalysisPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<GetAnalysisGetAnalysis200DataItem | null>(null);
  const [paginationState, setPaginationState] = useState({
    page: 1,
    perPage: 10,
  });

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { data: analysisInfo, isLoading, error } = useGetAllAnalysisQuery(paginationState);
  
  console.log("Selected Analysis:", selectedAnalysis);
  console.log(analysisInfo);

  const analysisData = analysisInfo?.data
  const totalPages = analysisInfo?.pagination?.totalPages || 1

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

       <div>
        
        {isLoading && (
         
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
             <AnalysisCardSkeleton />
             <AnalysisCardSkeleton />
             <AnalysisCardSkeleton />
           </div>
         )}
       </div>
       
        {!isLoading && (!analysisData || analysisData.length === 0) ? (
          <AnalysisEmptyState onRunAnalysis={handleRunAnalysis} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:grid-cols-2 ">
            <AnalysisCards
              analysisData={analysisData}
              setSelectedAnalysis={setSelectedAnalysis}
              setIsDetailsOpen={setIsDetailsOpen}
            />
            

               <Pagination
                currentPage={paginationState.page ?? 1}
                totalPages={totalPages}
                onPageChange={(page) => setPaginationState((s) => ({ ...(s || {}), page }))}
              />
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