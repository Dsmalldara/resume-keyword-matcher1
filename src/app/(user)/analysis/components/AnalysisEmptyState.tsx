import { Button } from "@/components/ui/button";
import { Plus, TrendingUp } from "lucide-react";

const AnalysisEmptyState = ({
  onRunAnalysis,
}: {
  onRunAnalysis: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
      <TrendingUp className="w-12 h-12 text-primary" />
    </div>
    <h3 className="text-xl font-semibold mb-2">No analyses yet</h3>
    <p className="text-muted-foreground mb-6 max-w-md">
      Run your first analysis to see how well your resume matches job
      descriptions and get personalized recommendations.
    </p>
    <Button size="lg" onClick={onRunAnalysis}>
      <Plus className="w-4 h-4 mr-2" />
      Run your first analysis
    </Button>
  </div>
);
export { AnalysisEmptyState };
