
;
import { FileText } from 'lucide-react';
import ActivityItem from './ActivityItem';
import { ActivityLog } from '@/api/models/activityLog';
import { useRecentActivity } from '../../Home/queries/activityQuery';


const RecentActivitySection = () => {
  const { data, isLoading, isError, refetch, isFetching } = useRecentActivity({
    limit: 5,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Failed to load recent activity
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const activities = data?.activities ?? [];

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Recent Activity
        </h3>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 disabled:opacity-50"
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {activities.map((activity: ActivityLog) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}

      
    </div>
  );
};

export default RecentActivitySection;