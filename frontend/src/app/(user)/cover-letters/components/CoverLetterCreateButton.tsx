import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import React from 'react'

type CoverLetterCreateButtonType = { isCreating: boolean; selectedResumeId: string, selectedAnalysisId: string } & React.ComponentProps<typeof Button>;
function CoverLetterCreateButton({isCreating, selectedResumeId, selectedAnalysisId, ...props}: CoverLetterCreateButtonType) {
  return (
   <Button
          disabled={isCreating || !selectedResumeId || !selectedAnalysisId}
          {...props}
          className={`
            relative px-6 py-3.5 rounded-lg 
            transition-all duration-200 ease-out
            shadow-lg hover:shadow-xl
          `}
        >
          {/* Background pulse effect when analyzing */}
          {isCreating&& (
            <span className="absolute inset-0 rounded-lg bg-white opacity-20 animate-pulse" />
          )}
          
          <TrendingUp 
            className={`w-5 h-5 transition-transform ${
              isCreating ? 'animate-bounce' : 'group-hover:scale-110'
            }`} />
          
          <span className="relative">
            {isCreating ? 'Generating' : 'Generate Letter'}
          </span>
          {isCreating && (
            <span className="flex gap-1">
              <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </span>
          )}
        </Button>
  )
}

export default CoverLetterCreateButton
