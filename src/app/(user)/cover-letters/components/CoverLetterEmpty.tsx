import { Button } from "@/components/ui/button";
import { Mail, Plus } from "lucide-react";

const CoverLetterEmptyState = ({
  onGenerate,
}: {
  onGenerate: (open: boolean) => void;
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
      <Mail className="w-12 h-12 text-primary" />
    </div>
    <h3 className="text-xl font-semibold mb-2">No cover letters yet</h3>
    <p className="text-muted-foreground mb-6 max-w-md">
      Generate personalized cover letters from your analyses to make stronger
      job applications.
    </p>
    s{" "}
    <Button size="lg" onClick={() => onGenerate(true)}>
      <Plus className="w-4 h-4 mr-2" />
      Generate your first cover letter
    </Button>
  </div>
);
export default CoverLetterEmptyState;
