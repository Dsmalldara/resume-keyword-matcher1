import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

const CoverLetterLoadingState = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                {/* User name skeleton */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-32 animate-pulse"></div>
                </div>
                
                {/* Job title skeleton */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-48 animate-pulse"></div>
                </div>
                
                {/* Date skeleton */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24 animate-pulse"></div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Preview text skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5 animate-pulse"></div>
            </div>

            {/* Resume used skeleton */}
            <div className="flex items-center gap-1">
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-20 animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-32 animate-pulse"></div>
            </div>
          </CardContent>

          <CardFooter className="flex gap-5 md:gap-6 pt-4">
            {/* Delete button skeleton */}
            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
            
            {/* View button skeleton */}
            <div className="h-9 w-36 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CoverLetterLoadingState;