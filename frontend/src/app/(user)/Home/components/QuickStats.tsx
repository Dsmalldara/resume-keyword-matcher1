

function QuickStats({stats}: {stats: {weeklyJobs: number; totalResumes: number}}) {
  return (
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
  )
}

export default QuickStats
