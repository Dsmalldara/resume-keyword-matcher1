
import { FileText,Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, TableHeader,  TableRow, TableHead,TableBody, TableCell,} from "../Table";
import StatusBadge from "@/components/StatusBadge";
import { Resume } from "@/api/models";
import { useDeleteResumeMutation } from "../../Home/mutations/resumeMutation";
import { DeleteAlertDialog } from "@/components/DeleteAlertDialog";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
const ResumeTable =  ({ resumes, isLoading }: { resumes: Resume[], isLoading:boolean })=> {
      const { mutate: deleteResume, isPending } = useDeleteResumeMutation();
  
  
    const onDeleteResume = (resumeId: string) => {
    
        deleteResume({ resumeId },
          {
            onSuccess: () => {
              toast.success("Resume deleted successfully");
            },
            onError: (error) => {
              toast.error(getErrorMessage(error));
            }
          }
        );
      }
     if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <DataTable>
          <TableHeader>
            <TableRow>
              <TableHead>Resume</TableHead>
              <TableHead>Date Uploaded</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </div>
    );
  }

return(
  <div className="overflow-x-auto">
    <DataTable>
      <TableHeader>
        <TableRow>
          <TableHead>Resume</TableHead>
          <TableHead>Date Uploaded</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resumes?.map((resume) => (
          <TableRow key={resume.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium">{resume.name}</span>
              </div>
            </TableCell>
            <TableCell>{resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
            <TableCell>
              <div className="flex justify-end">
                <StatusBadge status={(resume).status ?? 'pending'} />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-1">
                <DeleteAlertDialog
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  }
                  title="Delete Resume?"
                  description="This action cannot be undone. This will permanently delete your resume and all associated data."
                  onConfirm={() => {
                    if (resume.id) onDeleteResume(resume.id);
                  }}
                  isLoading={isPending}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  </div>)
};

export default ResumeTable;
