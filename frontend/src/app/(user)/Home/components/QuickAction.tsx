import { useState } from "react";
import { Plus, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import JobDescriptionDialog from "@/components/jobDescriptionDialog";
interface QuickActionProps {
  onAddResume?: () => void;
}

const QuickAction = ({ onAddResume }: QuickActionProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [jobDescriptionDialogOpen, setJobDescriptionDialogOpen] = useState(false);


 
  const handleAddJobDescription = () => {
    setPopoverOpen(false);
    setJobDescriptionDialogOpen(true);
  };

 
const handleAddResume = () => {
  onAddResume?.(); // Scroll first

};
  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button className="bg-gradient-to-r from-white to-gray-400 hover:from-gray-100 hover:to-gray-400 shadow-lg hover:shadow-xl transition-all duration-200">
            <Plus className="w-4 h-4 mr-2" />
            Quick Action
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align="end">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleAddResume}
            >
              <Upload className="w-4 h-4 mr-2" />
              Add Resume
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleAddJobDescription}
            >
              <FileText className="w-4 h-4 mr-2" />
              Add Job Description
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <JobDescriptionDialog
        open={jobDescriptionDialogOpen}
        onOpenChange={setJobDescriptionDialogOpen}
      />
    </>
  );
};

export default QuickAction;