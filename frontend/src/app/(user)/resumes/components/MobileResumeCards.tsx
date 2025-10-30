import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Eye, Trash2 } from "lucide-react";

const MobileResumeCards = ({
  resumes,
}: {
  resumes: { id: number; name: string; date: string; status: string }[];
}) => (
  <div className="space-y-4">
    {resumes?.map((resume) => (
      <Card key={resume.id}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium">{resume.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(resume.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <StatusBadge status={resume.status} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-900/30"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default MobileResumeCards;
