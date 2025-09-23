import { FileText, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../Table";
import StatusBadge from "@/components/StatusBadge";

const ResumeTable = ({
  resumes,
}: {
  resumes: { id: number; name: string; date: string; status: string }[];
}) => (
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
            <TableCell>{new Date(resume.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <StatusBadge status={resume.status} />
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  </div>
);

export default ResumeTable;
