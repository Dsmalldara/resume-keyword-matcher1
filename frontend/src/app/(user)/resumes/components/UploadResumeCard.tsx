import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CloudUpload, Upload } from "lucide-react";

const UploadResumeCard = () => (
  <Card className="h-fit">
    <CardContent className="p-8">
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CloudUpload className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Upload Resume</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your resume here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF, DOCX files up to 10MB
            </p>
          </div>
          <Button className="mt-4">
            <Upload className="w-4 h-4 mr-2" />
            Browse Files
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default UploadResumeCard;
