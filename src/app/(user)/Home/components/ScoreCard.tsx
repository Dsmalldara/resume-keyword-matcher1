import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Target, ArrowUp, LucideIcon } from "lucide-react";

type ColorVariant = "emerald" | "blue" | "purple" | "amber" | "rose" | "indigo";

interface ScoreCardProps {
  stats: {
    overallScore: number;
    avgImprovement: number;
  };
  title?: string;
  description?: string;
  colorVariant?: ColorVariant;
  icon?: LucideIcon;
  showImprovement?: boolean;
}

const colorClasses = {
  emerald: {
    card: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800",
    title: "text-emerald-700 dark:text-emerald-300",
    icon: "text-emerald-600",
    score: "text-emerald-900 dark:text-emerald-100",
    improvement: "text-emerald-600",
    description: "text-emerald-700 dark:text-emerald-400",
  },
  blue: {
    card: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800",
    title: "text-blue-700 dark:text-blue-300",
    icon: "text-blue-600",
    score: "text-blue-900 dark:text-blue-100",
    improvement: "text-blue-600",
    description: "text-blue-700 dark:text-blue-400",
  },
  purple: {
    card: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800",
    title: "text-purple-700 dark:text-purple-300",
    icon: "text-purple-600",
    score: "text-purple-900 dark:text-purple-100",
    improvement: "text-purple-600",
    description: "text-purple-700 dark:text-purple-400",
  },
  amber: {
    card: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800",
    title: "text-amber-700 dark:text-amber-300",
    icon: "text-amber-600",
    score: "text-amber-900 dark:text-amber-100",
    improvement: "text-amber-600",
    description: "text-amber-700 dark:text-amber-400",
  },
  rose: {
    card: "bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900 border-rose-200 dark:border-rose-800",
    title: "text-rose-700 dark:text-rose-300",
    icon: "text-rose-600",
    score: "text-rose-900 dark:text-rose-100",
    improvement: "text-rose-600",
    description: "text-rose-700 dark:text-rose-400",
  },
  indigo: {
    card: "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800",
    title: "text-indigo-700 dark:text-indigo-300",
    icon: "text-indigo-600",
    score: "text-indigo-900 dark:text-indigo-100",
    improvement: "text-indigo-600",
    description: "text-indigo-700 dark:text-indigo-400",
  },
};

function ScoreCard({
  stats,
  title = "Average Match Score",
  description = "Across all resumes",
  colorVariant = "emerald",
  icon: Icon = Target,
  showImprovement = true,
}: ScoreCardProps) {
  const colors = colorClasses[colorVariant];

  return (
    <Card
      className={`${colors.card} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-sm font-medium ${colors.title}`}>
            {title}
          </CardTitle>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${colors.score}`}>
            {stats.overallScore}%
          </span>
          {showImprovement && (
            <span
              className={`flex items-center text-sm ${colors.improvement} font-medium`}
            >
              <ArrowUp className="w-3 h-3 mr-1" />+{stats.avgImprovement}%
            </span>
          )}
        </div>
        <p className={`${colors.description} text-xs mt-1`}>{description}</p>
      </CardContent>
    </Card>
  );
}

export default ScoreCard;
