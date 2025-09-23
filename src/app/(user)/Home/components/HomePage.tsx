import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Upload,
  FileText,
  TrendingUp,
  Clock,
  BarChart3,
  Plus,
} from "lucide-react";
import ScoreCard from "./ScoreCard";
import ResumeContentGrid from "../../resumes/components/ResumeContentGrid";
import ResumeItem from "../../resumes/components/ResumeItem";
import { recentActivities, stats } from "./mocks";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="py-7.5 mx-7.5 space-y-7.5">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold">Home</h1>
            <div className="flex gap-3">
              <Button className="bg-gradient-to-r from-white- to-gray-400 hover:from-gray-100 hover:to-gray-400 shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Quick Action
              </Button>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Track your resume optimization progress and job matching insights
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ScoreCard
            stats={{ overallScore: 85, avgImprovement: 12 }}
            title="Average Match Score"
            description="Across all resumes"
          />

          <ScoreCard
            stats={{ overallScore: 24, avgImprovement: 0 }}
            title="Total Resumes"
            description="Ready for matching"
            colorVariant="blue"
            icon={FileText}
            showImprovement={false}
          />

          <ScoreCard
            stats={{ overallScore: 156, avgImprovement: 23 }}
            title="Jobs Analyzed"
            description="This month"
            colorVariant="purple"
            icon={BarChart3}
          />

          <ScoreCard
            stats={{ overallScore: 94, avgImprovement: 8 }}
            title="Best Match"
            description="Personal record"
            colorVariant="amber"
            icon={TrendingUp}
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
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Get started with your next optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 h-12">
                <Upload className="w-4 h-4 mr-2 text-white" />
                <p className="text-white ">Upload New Resume</p>
              </Button>
              <Button
                variant="outline"
                className="w-full border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200 h-12"
              >
                <FileText className="w-4 h-4 mr-2" />
                Add Job Description
              </Button>
              <div className="pt-4 border-t">
                <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-3">
                  Quick Stats
                </h4>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>This week:</span>
                    <span className="font-medium">
                      {stats.weeklyJobs} jobs analyzed
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active resumes:</span>
                    <span className="font-medium">
                      {stats.totalResumes} files
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
              {recentActivities.map((activity, index) => (
                <div key={index} className="">
                  <ResumeItem recentActivities={activity} />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full">
              View All Activity
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
