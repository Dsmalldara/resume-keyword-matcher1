import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
      <FileText className="w-10 h-10 text-primary" />
    </div>
    <h3 className="text-xl font-semibold mb-2">No resumes uploaded</h3>
    <p className="text-muted-foreground text-center mb-6 max-w-sm">
      Get started by uploading your first resume to analyze and manage your
      documents.
    </p>
    <Button size="lg">
      <Plus className="w-4 h-4 mr-2" />
      Upload First Resume
    </Button>
  </div>
);

export default EmptyState;
