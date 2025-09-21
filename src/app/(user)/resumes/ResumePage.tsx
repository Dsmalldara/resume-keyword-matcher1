"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Eye, Trash2, Plus, CloudUpload, Upload } from "lucide-react";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  DataTable,
} from "./Table";

export default function ResumePage() {
  const resumes = [
    { id: 1, name: "Resume1.pdf", date: "2024-01-15", status: "Analyzed" },
    { id: 2, name: "Resume2.docx", date: "2024-01-14", status: "Pending" },
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    interface StatusColorMap {
      [key: string]: string;
    }

    const getStatusColor = (status: string): string => {
      const statusColors: StatusColorMap = {
        Analyzed:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        Pending:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      };

      return (
        statusColors[status] ||
        "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
      );
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}
      >
        {status}
      </span>
    );
  };

  const UploadCard = () => (
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

  const ResumeTable = () => (
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
          {resumes.map((resume) => (
            <TableRow key={resume.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium">{resume.name}</span>
                </div>
              </TableCell>
              <TableCell>
                {new Date(resume.date).toLocaleDateString()}
              </TableCell>
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

  const MobileResumeCards = () => (
    <div className="space-y-4">
      {resumes.map((resume) => (
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

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resumes</h1>
            <p className="text-muted-foreground mt-1 lg:w-[15rem]">
              Upload, analyze, and manage your resume documents
            </p>
          </div>
          <Button size="lg" className="sm:w-auto w-full">
            <Plus className="w-4 h-4 mr-2" />
            Upload Resume
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-4">
            <UploadCard />
          </div>

          {/* Resume List Section */}
          <div className="lg:col-span-8">
            <Card>
              <CardContent className="p-6">
                {resumes.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold">
                        Your Resumes ({resumes.length})
                      </h2>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block">
                      <ResumeTable />
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden">
                      <MobileResumeCards />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
