import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export const AnalysisCardSkeleton = () => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            {/* Resume Name Skeleton */}
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
            
            <div className="space-y-1">
              {/* Job Title Skeleton */}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
              </div>
              
              {/* Company Skeleton */}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/5 animate-pulse" />
              </div>
              
              {/* Date Skeleton */}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Circular Progress Skeleton */}
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse" />
        </div>

        {/* Quick Overview Button Skeleton */}
        <div className="pt-2">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        {/* Button Skeletons */}
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1 animate-pulse" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse" />
      </CardFooter>
    </Card>
  );
};
