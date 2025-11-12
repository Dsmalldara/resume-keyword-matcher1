import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";


export const ViewLetterButton = ({ 
  coverLetterId, 
  onView
}: { 
  coverLetterId: string;
  onView: (id: string) => void;
}) => {
  return (
    <Button 
      variant="outline"
      onClick={() => onView(coverLetterId)}
      className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      <FileText className="w-4 h-4" />
      View Full Letter
    </Button>
  );
};