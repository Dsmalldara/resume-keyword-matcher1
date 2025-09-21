interface Analysis {
  resumeName: string;
  matchScore: number;
  jobTitle: string;
  company: string;
  summary: string;
  strengths: string[];
  gaps: string[];
  nextSteps: string;
}

interface AnalysisModalProps {
  analysis: Analysis | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}
interface AnalysisResult extends Analysis {
  id: number;
  dateAnalyzed: string;
  status: "Strong" | "Moderate" | "Weak";
}

export type { Analysis, AnalysisModalProps, AnalysisResult };
