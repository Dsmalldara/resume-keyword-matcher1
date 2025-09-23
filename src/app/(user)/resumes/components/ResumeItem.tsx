import { FileText, Users } from "lucide-react";

function ResumeItem({
  recentActivities,
}: {
  recentActivities: {
    type: string;
    name: string;
    time?: string;
    score?: number;
    matches?: number;
  };
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 ">
      <div className="flex items-center gap-4">
        <div
          className={`p-2 rounded-lg ${
            recentActivities.type === "resume"
              ? "bg-blue-100 dark:bg-blue-900"
              : "bg-purple-100 dark:bg-purple-900"
          }`}
        >
          {recentActivities.type === "resume" ? (
            <FileText
              className={`w-4 h-4 ${
                recentActivities.type === "resume"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-purple-600 dark:text-purple-400"
              }`}
            />
          ) : (
            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          )}
        </div>
        <div>
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-md">
              {recentActivities.name}
            </p>
            <p className="text-sm text-slate-500">{recentActivities.time}</p>
          </div>
        </div>
      </div>
      <div className="text-right">
        {recentActivities.score && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              recentActivities.score >= 90
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                : recentActivities.score >= 75
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {recentActivities.score}% match
          </span>
        )}
        {recentActivities.matches && (
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {recentActivities.matches} matches
          </span>
        )}
      </div>
    </div>
  );
}

export default ResumeItem;
