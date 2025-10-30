import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { FileText, Copy, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { coverLetterType } from "./types";
// Cover Letter View/Edit Modal
const CoverLetterModal = ({
  coverLetter,
  isOpen,
  onOpenChange,
}: {
  coverLetter: coverLetterType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  if (!coverLetter) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter.fullText);
      toast.success("Cover letter text has been copied successfully.");
    } catch (err) {
      toast.error("Failed to copy text to clipboard.", err as undefined);
    }
  };

  const handleDownload = () => {
    // Placeholder for download functionality
    toast.success(
      "Download started - Your cover letter is being prepared for download.",
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Cover Letter - {coverLetter.jobTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Metadata */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Position:</span>{" "}
                {coverLetter.jobTitle}
              </div>
              <div>
                <span className="font-medium">Company:</span>{" "}
                {coverLetter.company}
              </div>
              <div>
                <span className="font-medium">Resume Used:</span>{" "}
                {coverLetter.resumeUsed}
              </div>
              <div>
                <span className="font-medium">Generated:</span>{" "}
                {new Date(coverLetter.dateGenerated).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Cover Letter Content */}
          <div className="max-h-[400px] overflow-y-auto border rounded-lg p-4 bg-white dark:bg-gray-950">
            <div className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
              {coverLetter.fullText}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Text
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoverLetterModal;
