"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Eye, Trash2, Plus, CloudUpload } from "lucide-react";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  DataTable,
} from "./Table";

export default function ResumePage() {
  // Mock data - replace with your state
  const resumes = [
    { id: 1, name: "Resume1.pdf", date: "2024-01-15", status: "Analyzed" },
    { id: 2, name: "Resume2.docx", date: "2024-01-14", status: "Pending" },
  ];

  return (
    <div className="h-full w-full p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Resumes</h1>
          <p className="text-muted-foreground">Manage your resumes</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Upload Resume
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 h-[calc(100%-120px)]">
        {/* Upload Card */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center h-full flex flex-col justify-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center">
                  <CloudUpload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Drop files here</h3>
                  <p className="text-muted-foreground mb-4">
                    Or click to browse
                  </p>
                  <Button variant="outline">Browse Files</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumes List */}
        <div className="lg:col-span-4 flex flex-col">
          {resumes.length === 0 ? (
            /* Empty State */
            <Card className="flex-1">
              <CardContent className="p-16 text-center h-full flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center">
                    <CloudUpload className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">
                      No resumes uploaded yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Upload your first resume to get started
                    </p>
                    <Button>Upload your first resume</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex-1 flex flex-col">
              <CardContent className="p-6 flex-1">
                {/* Desktop Table */}
                <div className="hidden md:block h-full">
                  <DataTable>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Resume Name</TableHead>
                        <TableHead>Date Uploaded</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resumes.map((resume) => (
                        <TableRow key={resume.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              {resume.name}
                            </div>
                          </TableCell>
                          <TableCell>{resume.date}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs">
                              {resume.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </DataTable>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {resumes.map((resume) => (
                    <Card key={resume.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span className="font-medium">{resume.name}</span>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs">
                            {resume.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {resume.date}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
