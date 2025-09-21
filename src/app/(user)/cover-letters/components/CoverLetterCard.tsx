import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  User,
  Building,
  Calendar,
  Badge,
  Check,
  Edit,
  Eye,
  Copy,
  Download,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { coverLetterType } from "./types";

const CoverLetterCard = ({
  coverLetter,
  onView,
  onDelete,
}: {
  coverLetter: coverLetterType;
  onView: (letter: coverLetterType) => void;
  onDelete: (id: string) => void;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Finalized":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "Draft":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter.fullText);
      toast.success("Cover letter text has been copied successfully.");
    } catch {
      toast.error("Failed to copy text to clipboard.");
    }
  };

  const handleDownload = () => {
    toast.success("Your cover letter is being prepared for download.");
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">{coverLetter.jobTitle}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {coverLetter.company}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {new Date(coverLetter.dateGenerated).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(coverLetter.status)}>
            {coverLetter.status === "Finalized" ? (
              <Check className="w-3 h-3 mr-1" />
            ) : (
              <Edit className="w-3 h-3 mr-1" />
            )}
            {coverLetter.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {coverLetter.preview}
        </div>

        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Resume used:</span>{" "}
          {coverLetter.resumeUsed}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Button variant="outline" size="sm" onClick={() => onView(coverLetter)}>
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(coverLetter.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 ml-auto"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CoverLetterCard;
