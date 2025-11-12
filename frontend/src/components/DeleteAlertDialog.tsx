// components/ui/delete-alert-dialog.tsx
import {
  AlertDialog, AlertDialogAction,
  AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,} from "@/components/ui/alert-dialog";
import { ReactNode } from "react";

interface DeleteAlertDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteAlertDialog({
  trigger,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete this item.",
  onConfirm,
  isLoading = false,
}: DeleteAlertDialogProps) {

     const handleConfirm = () => {
    onConfirm();
    // Don't close here - let the parent close it after success
  };


  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // Prevent default close behavior
              handleConfirm();
            }}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}