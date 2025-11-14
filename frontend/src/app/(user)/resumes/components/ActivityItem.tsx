import React, { useState } from "react";
import {
  FileText,
  Users,
  Trash2,
  Send,
  User,
  Briefcase,
  Clock,
  ChevronRight,
  TrendingUp,
  Upload,
  Trash,
} from "lucide-react";
import { ActivityLog } from "@/api/models/activityLog";

interface ActivityItemProps {
  activity: ActivityLog;
}

const getActivityIcon = (type: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    RESUME_UPLOADED: <FileText className="w-4 h-4" />,
    RESUME_DELETED: <Trash2 className="w-4 h-4" />,
    JOB_MATCHED: <Briefcase className="w-4 h-4" />,
    JOB_APPLIED: <Send className="w-4 h-4" />,
    PROFILE_UPDATED: <User className="w-4 h-4" />,
  };
  return iconMap[type] || <FileText className="w-4 h-4" />;
};

// Enhanced icon logic based on message content
const getEnhancedActivityIcon = (message: string) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("analyz")) {
    return <TrendingUp className="w-4 h-4" />;
  }
  if (lowerMessage.includes("upload")) {
    return <Upload className="w-4 h-4" />;
  }
  if (lowerMessage.includes("delet")) {
    return <Trash className="w-4 h-4" />;
  }

  return <FileText className="w-4 h-4" />;
};

// Enhanced color logic based on message content
const getEnhancedActivityColorByMessage = (message: string) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("analyz")) {
    return {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      icon: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
      glow: "group-hover:shadow-purple-100 dark:group-hover:shadow-purple-900/50",
    };
  }
  if (lowerMessage.includes("upload")) {
    return {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      icon: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
      glow: "group-hover:shadow-blue-100 dark:group-hover:shadow-blue-900/50",
    };
  }
  if (lowerMessage.includes("delet")) {
    return {
      bg: "bg-red-50 dark:bg-red-900/20",
      icon: "text-red-600 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
      glow: "group-hover:shadow-red-100 dark:group-hover:shadow-red-900/50",
    };
  }

  return {
    bg: "bg-slate-50 dark:bg-slate-800",
    icon: "text-slate-600 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-700",
    glow: "group-hover:shadow-slate-100 dark:group-hover:shadow-slate-900/50",
  };
};

const getActivityColor = (type: string) => {
  const colorMap: Record<
    string,
    { bg: string; icon: string; bgDark: string; iconDark: string }
  > = {
    RESUME_UPLOADED: {
      bg: "bg-blue-100",
      icon: "text-blue-600",
      bgDark: "dark:bg-blue-900",
      iconDark: "dark:text-blue-400",
    },
    RESUME_DELETED: {
      bg: "bg-red-100",
      icon: "text-red-600",
      bgDark: "dark:bg-red-900",
      iconDark: "dark:text-red-400",
    },
    JOB_MATCHED: {
      bg: "bg-purple-100",
      icon: "text-purple-600",
      bgDark: "dark:bg-purple-900",
      iconDark: "dark:text-purple-400",
    },
    JOB_APPLIED: {
      bg: "bg-green-100",
      icon: "text-green-600",
      bgDark: "dark:bg-green-900",
      iconDark: "dark:text-green-400",
    },
    PROFILE_UPDATED: {
      bg: "bg-amber-100",
      icon: "text-amber-600",
      bgDark: "dark:bg-amber-900",
      iconDark: "dark:text-amber-400",
    },
  };

  return (
    colorMap[type] || {
      bg: "bg-slate-100",
      icon: "text-slate-600",
      bgDark: "dark:bg-slate-800",
      iconDark: "dark:text-slate-400",
    }
  );
};

const getMatchScoreColor = (score: number) => {
  if (score >= 90) {
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
  }
  if (score >= 75) {
    return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
  }
  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
};

const getEnhancedMatchScoreColor = (score: number) => {
  if (score >= 90) {
    return "bg-emerald-500 text-white dark:bg-emerald-600";
  }
  if (score >= 75) {
    return "bg-amber-500 text-white dark:bg-amber-600";
  }
  return "bg-rose-500 text-white dark:bg-rose-600";
};

const formatTimeAgo = (date: string): string => {
  const now = new Date();
  const activityDate = new Date(date);
  const seconds = Math.floor((now.getTime() - activityDate.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return activityDate.toLocaleDateString();
};

// Check if message contains keywords for enhanced UI
const shouldUseEnhancedUI = (message: string): boolean => {
  const keywords = ["analyz", "delet", "upload", "create", "match"];
  const lowerMessage = message.toLowerCase();
  return keywords.some((keyword) => lowerMessage.includes(keyword));
};

// Enhanced Activity Item Component
function EnhancedActivityItem({ activity }: ActivityItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = getEnhancedActivityColorByMessage(activity.message);
  const icon = getEnhancedActivityIcon(activity.message);

  const metadata = activity.metadata as Record<string, any> | null;
  const matchScore = metadata?.matchScore as number | undefined;
  const matches = metadata?.matches as number | undefined;

  return (
    <div
      className={`
        relative flex items-center justify-between p-4 
        bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700
        transition-all duration-300
        hover:shadow-lg hover:-translate-y-0.5
        cursor-pointer group
        text-[0.7rem] md:text-base
        ${colors.glow}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50/50 dark:via-slate-700/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

      <div className="flex items-center gap-4 flex-1 min-w-0 relative z-10">
        <div
          className={`
            relative p-3 rounded-xl ${colors.bg} border ${colors.border}
            transition-all duration-300
            ${isHovered ? "scale-110 rotate-3" : "scale-100 rotate-0"}
          `}
        >
          <div className={`${colors.icon} transition-transform duration-300`}>
            {icon}
          </div>

          {isHovered && (
            <div
              className={`absolute inset-0 rounded-xl ${colors.bg} animate-ping opacity-75`}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            {activity.message}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {formatTimeAgo(activity.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4 relative z-10">
        {matchScore !== undefined && (
          <span
            className={`
              inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold
              ${getEnhancedMatchScoreColor(matchScore)}
              shadow-sm transition-transform duration-300
              ${isHovered ? "scale-105" : "scale-100"}
            `}
          >
            {matchScore}% match
          </span>
        )}
        {matches !== undefined && matches > 0 && (
          <span
            className={`
            inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold
            bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 
            border border-slate-200 dark:border-slate-500
            transition-transform duration-300
            ${isHovered ? "scale-105" : "scale-100"}
          `}
          >
            <Users className="w-3.5 h-3.5 mr-1.5" />
            {matches}
          </span>
        )}

        <ChevronRight
          className={`
            w-5 h-5 text-slate-400 dark:text-slate-500 transition-all duration-300
            ${isHovered ? "translate-x-1 text-slate-600 dark:text-slate-300" : "translate-x-0"}
          `}
        />
      </div>
    </div>
  );
}

// Standard Activity Item Component
function StandardActivityItem({ activity }: ActivityItemProps) {
  const colors = getActivityColor(activity.type);
  const icon = getActivityIcon(activity.type);

  const metadata = activity.metadata as Record<string, any> | null;
  const matchScore = metadata?.matchScore as number | undefined;
  const matches = metadata?.matches as number | undefined;

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 group cursor-pointer">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div
          className={`p-2 rounded-lg ${colors.bg} ${colors.bgDark} transition-transform group-hover:scale-110`}
        >
          <div className={`${colors.icon} ${colors.iconDark}`}>{icon}</div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium md:text-base text-sm text-slate-700 dark:text-slate-100 truncate">
            {activity.message}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {formatTimeAgo(activity.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        {matchScore !== undefined && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMatchScoreColor(matchScore)}`}
          >
            {matchScore}% match
          </span>
        )}
        {matches !== undefined && matches > 0 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200">
            <Users className="w-3 h-3 mr-1" />
            {matches}
          </span>
        )}
      </div>
    </div>
  );
}

// Main ActivityItem component that decides which UI to use
function ActivityItem({ activity }: ActivityItemProps) {
  const useEnhancedUI = shouldUseEnhancedUI(activity.message);

  return useEnhancedUI ? (
    <EnhancedActivityItem activity={activity} />
  ) : (
    <StandardActivityItem activity={activity} />
  );
}

export default ActivityItem;
