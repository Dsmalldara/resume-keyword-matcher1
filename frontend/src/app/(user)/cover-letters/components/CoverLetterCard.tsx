import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter} from "@/components/ui/card";
import { User, Building, Calendar,  Trash2, FileText,} from "lucide-react";
import { toast } from "sonner";
import { coverLetterType } from "./types";
import { Copyable } from "@/components/copy-able";
import { useGetCoverLetters, useGetIndividualLetter } from "../queries/useGetCoverLetter";
import CoverLetterEmptyState from "./CoverLetterEmpty";
import { GetCoverlettersLetters200CoverLettersItem } from "@/api/models";
import CoverLetterViewer from "./CoverLetterViewer";
import { useDeleteCoverLetter } from "../mutations/deleteCoverLetterMutation";
import { DeleteAlertDialog } from "@/components/DeleteAlertDialog";
import { getErrorMessage } from "@/lib/utils";

const CoverLetterCard = ({ coverLetter, onView,onDelete,}: {
  coverLetter:GetCoverlettersLetters200CoverLettersItem;
  onView: (letter: coverLetterType) => void;
  onDelete: (id: string) => void;}) => {
  const [selectedLetterId, setSelectedLetterId] = useState<string | undefined>(undefined);
  const [viewerOpen, setViewerOpen] = useState(false);

   const  {mutate: deleteCoverLetter, isPending} = useDeleteCoverLetter()
     const onDeleteCoverLetter = (letterId: string) => {
       
           deleteCoverLetter({ id: letterId},
             {
               onSuccess: () => {
                 toast.success("Cover letter deleted successfully");
               },
               onError: (error) => {
                 toast.error(getErrorMessage(error));
               }
             }
           );
         }
 return (
  <>
  {
    coverLetter && (
      <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">{coverLetter.resume?.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {coverLetter.job?.title || "N/A"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {coverLetter.updatedAt ? new Date(coverLetter.updatedAt).toLocaleDateString() : "N/A"}
              </p> 
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {coverLetter.preview}
        </div>

        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Resume used:</span>{" "}
          {coverLetter.resume?.name || "N/A"}
        </div>
      </CardContent>

      <CardFooter className="flex  gap-5 md:gap-6  pt-4">
   
         <DeleteAlertDialog
            trigger={
              <Button
                variant="ghost"  size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30" >
                <Trash2 className="w-4 h-4" />
              </Button>
            }
            title="Delete Cover Letter?"
            description="This action cannot be undone. This will permanently delete your cover letter and all associated data."
            onConfirm={ () => { if (coverLetter.id) onDeleteCoverLetter(coverLetter.id)} }
            isLoading={isPending}
               />

              <Button 
          variant="outline"
          onClick={() => {
            coverLetter.id && setSelectedLetterId(coverLetter.id);
            setViewerOpen(true);
          }}
          className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <FileText className="w-4 h-4" />
          View Full Letter
        </Button>

      </CardFooter>
      <CoverLetterViewer
        isOpen={viewerOpen}
        onClose={() => { setViewerOpen(false)}}
        coverLetterId={selectedLetterId}
      
      />
    </Card>
  
    )
  }
  </>
 )
};

export default CoverLetterCard;
