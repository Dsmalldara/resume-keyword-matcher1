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
  Target,
  Users,
  BarChart3,
  Plus,
  ArrowUp,
} from "lucide-react";

export default function HomePage() {
  // Mock data - in real app this would come from props/state
  const stats = {
    overallScore: 85,
    totalResumes: 12,
    jobsAnalyzed: 8,
    weeklyJobs: 3,
    topMatch: 96,
    avgImprovement: 12,
  };

  const recentActivities = [
    {
      type: "resume",
      name: "Senior_Developer_Resume.pdf",
      time: "2 hours ago",
      score: 92,
    },
    {
      type: "resume",
      name: "Frontend_Specialist.pdf",
      time: "5 hours ago",
      score: 78,
    },
    {
      type: "job",
      name: "Full Stack Engineer at TechCorp",
      time: "1 day ago",
      matches: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="py-7.5 mx-7.5 space-y-7.5">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold">Dashboard</h1>
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
          {/* Overall Score Card */}
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  Average Match Score
                </CardTitle>
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                  {stats.overallScore}%
                </span>
                <span className="flex items-center text-sm text-emerald-600 font-medium">
                  <ArrowUp className="w-3 h-3 mr-1" />+{stats.avgImprovement}%
                </span>
              </div>
              <p className="text-emerald-700 dark:text-emerald-400 text-xs mt-1">
                Across all resumes
              </p>
            </CardContent>
          </Card>

          {/* Total Resumes */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 hover:translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Total Resumes
                </CardTitle>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {stats.totalResumes}
                </span>
              </div>
              <p className="text-blue-700 dark:text-blue-400 text-xs mt-1">
                Ready for matching
              </p>
            </CardContent>
          </Card>

          {/* Jobs Analyzed */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Jobs Analyzed
                </CardTitle>
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {stats.jobsAnalyzed}
                </span>
              </div>
              <p className="text-purple-700 dark:text-purple-400 text-xs mt-1">
                This month
              </p>
            </CardContent>
          </Card>

          {/* Best Match */}
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all duration-300 hover:translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  Best Match
                </CardTitle>
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                  {stats.topMatch}%
                </span>
              </div>
              <p className="text-amber-700 dark:text-amber-400 text-xs mt-1">
                Personal record
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Match Score Trends
              </CardTitle>
              <CardDescription>
                Your resume matching performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

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
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        activity.type === "resume"
                          ? "bg-blue-100 dark:bg-blue-900"
                          : "bg-purple-100 dark:bg-purple-900"
                      }`}
                    >
                      {activity.type === "resume" ? (
                        <FileText
                          className={`w-4 h-4 ${
                            activity.type === "resume"
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-purple-600 dark:text-purple-400"
                          }`}
                        />
                      ) : (
                        <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-md">
                        {activity.name}
                      </p>
                      <p className="text-sm text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.score && (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.score >= 90
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                            : activity.score >= 75
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {activity.score}% match
                      </span>
                    )}
                    {activity.matches && (
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {activity.matches} matches
                      </span>
                    )}
                  </div>
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
