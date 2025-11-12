import { FileText, Trash2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { Resume } from "@/api/models";

const MobileResumeCards = ({ 
  resumes, 
  isLoading,
  onDelete 
}: { 
  resumes: Resume[], 
  isLoading: boolean,
  onDelete?: (id: string) => void 
}) => { 
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              </div>
              <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse ml-15" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {resumes?.map((resume) => (
        <Card 
          key={resume.id} 
          className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <CardContent className="p-3">
            {/* Header Section */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-600 dark:via-blue-700 dark:to-indigo-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/20">
                <FileText className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate mb-0.5">
                  {resume.name}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>
                    {resume.createdAt 
                      ? new Date(resume.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
              <StatusBadge status={(resume).status ?? 'pending'} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => resume.id && onDelete?.(resume.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 h-8 w-8 p-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default MobileResumeCards;