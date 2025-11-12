import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import React from 'react'

type IsAnalyzingButtonType = { isAnalyzing: boolean; selectedResumeId: string; } & React.ComponentProps<typeof Button>;
function IsAnalyzingButton({isAnalyzing, selectedResumeId, ...props}: IsAnalyzingButtonType) {
  return (
   <Button
          disabled={isAnalyzing || !selectedResumeId}
          {...props}
          className={`
            relative px-6 py-3.5 rounded-lg 
            transition-all duration-200 ease-out
            shadow-lg hover:shadow-xl
          `}
        >
          {/* Background pulse effect when analyzing */}
          {isAnalyzing && (
            <span className="absolute inset-0 rounded-lg bg-white opacity-20 animate-pulse" />
          )}
          
          <TrendingUp 
            className={`w-5 h-5 transition-transform ${
              isAnalyzing ? 'animate-bounce' : 'group-hover:scale-110'
            }`} />
          
          <span className="relative">
            {isAnalyzing ? 'Analyzing' : 'Run Analysis'}
          </span>
          {isAnalyzing && (
            <span className="flex gap-1">
              <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </span>
          )}
        </Button>
  )
}

export default IsAnalyzingButton
