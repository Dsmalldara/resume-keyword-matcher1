"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader,  CardTitle,} from "@/components/ui/card";
import { Upload, FileText, TrendingUp, Clock, BarChart3, Plus,} from "lucide-react";
import ScoreCard from "./ScoreCard";
import ResumeContentGrid from "../../resumes/components/ResumeContentGrid";
import {  stats } from "./mocks";
import RecentActivitySection from "../../resumes/components/RecentActivitySection";
import QuickAction from "./QuickAction";
import { useRef, useState } from "react";
import { useResumeCount } from "@/hooks/useResumeCount";
import QuickActionSection from "./QuickActionSection";
import QuickStats from "./QuickStats";
import FileUploader from "./FileUploader";
import useGetAverageImprovementInsights, { useGetBestMatchScore, useGetJobAnalysisInsights } from "../queries/insightsQuery";

export default function HomePage() {
  const resumeSectionRef = useRef<HTMLDivElement | null>(null);
  const {resumeCount, isLoading:isResumeCountLoading, isError:isResumeError} = useResumeCount();
  const {data: averageImprovementData, isLoading:isAverageImprovementLoading, isError:isAverageImprovementError} = useGetAverageImprovementInsights()
  const {data:analysisInsights, isLoading:isAnalysisInsightsLoading, isError:isAnalysisInsightsError} = useGetJobAnalysisInsights()
  const {data: bestMatchData, isLoading:isBestMatchLoading, isError:isBestMatchError} = useGetBestMatchScore()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="py-7.5 mx-7.5 space-y-7.5">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold">Home</h1>
            <div className="flex gap-3">
              <QuickAction onAddResume={() => {
                  console.log('Ref current:', resumeSectionRef.current);
                  resumeSectionRef.current?.scrollIntoView({behavior: 'smooth'});
                }} />
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Track your resume optimization progress and job matching insights
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ScoreCard
            stats={{ overallScore: `${averageImprovementData?.overallScore ?? 0}%`, avgImprovement: averageImprovementData?.AvgImprovement ?? undefined }}
            title="Average Match Score"
            description="Across all resumes"
            isError={isAverageImprovementError}
            isLoading={isAverageImprovementLoading}
            icon={Upload}
            showImprovement={true}
          />

          <ScoreCard
            stats={{ overallScore: resumeCount, avgImprovement: 0 }}
            title="Total Resumes"
            description="Ready for matching"
            colorVariant="blue"
            icon={FileText}
            showImprovement={false}
            isLoading={isResumeCountLoading}
            isError={isResumeError}
          />
          
          <ScoreCard
            stats={{ overallScore: `${analysisInsights?.jobsAnalyzed}`, avgImprovement: 0 }}
            title="Jobs Analyzed"
            description="Total Jobs Analyzed"
            colorVariant="purple"
            icon={BarChart3}
            showImprovement={false}
            isLoading={isAnalysisInsightsLoading}
            isError={isAnalysisInsightsError}

          />

          <ScoreCard
            stats={{ overallScore: `${bestMatchData?.bestMatch}%`, avgImprovement: 0 }}
            title="Best Match"
            description="Personal record"
            colorVariant="amber"
            icon={TrendingUp}
            isLoading={isBestMatchLoading}
            isError={isBestMatchError}
            showImprovement={false}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <ResumeContentGrid
            title="Match Score Trends"
            description="Your resume matching performance over time"
            icon={BarChart3}
          >
            <div className="h-64 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-400">
                  Interactive Chart Component
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Line chart showing match scores over time
                </p>
              </div>
            </div>
          </ResumeContentGrid>

          {/* Quick Actions */}
          <QuickActionSection >
             <FileUploader ref={resumeSectionRef} />
          </QuickActionSection>
          
       <QuickStats stats={stats}  />
        </div>

        {/* Recent Activities */}
        <Card className="mt-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest resume uploads and job matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <div  className="">
                 <RecentActivitySection />
                </div>

            </div>
          </CardContent>
          <CardFooter>
            <Button  className="w-full md:w-fit mx-auto justify-center">
              View All Activity
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

