
interface AnalysisHighlightProps {
  score: number;
  strengths?: string[];
  gaps?: string[];
}

const AnalysisHighlight = ({ score, strengths = [], gaps = [] }: AnalysisHighlightProps) => {
  const isGoodMatch = score >= 65;

  if (isGoodMatch && strengths.length > 0) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-green-500 rounded-full"></div>
          <h5 className="text-xs font-semibold text-green-700 dark:text-green-400">
            Top Strength
          </h5>
        </div>
        <div className="flex gap-2 items-start pl-3">
          <span className="text-green-500 text-xs mt-0.5">✓</span>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {strengths[0]}
          </p>
        </div>
        {strengths.length > 1 && (
          <p className="text-xs text-muted-foreground pl-3">
            +{strengths.length - 1} more {strengths.length === 2 ? 'strength' : 'strengths'}
          </p>
        )}
      </div>
    );
  }

  if (!isGoodMatch && gaps.length > 0) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-red-500 rounded-full"></div>
          <h5 className="text-xs font-semibold text-red-700 dark:text-red-400">
            Key Gap
          </h5>
        </div>
        <div className="flex gap-2 items-start pl-3">
          <span className="text-red-500 text-xs mt-0.5">✗</span>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {gaps[0]}
          </p>
        </div>
        {gaps.length > 1 && (
          <p className="text-xs text-muted-foreground pl-3">
            +{gaps.length - 1} more {gaps.length === 2 ? 'gap' : 'gaps'}
          </p>
        )}
      </div>
    );
  }

  return null;
};

export default AnalysisHighlight;