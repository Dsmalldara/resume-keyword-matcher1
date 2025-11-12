import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

type JobDescriptionTextAreaProps = React.ComponentProps<typeof Textarea> & {
  label?: string;
};

export const JobDescriptionTextArea = ({ label, ...props }: JobDescriptionTextAreaProps) => (
  <div className="flex flex-col gap-2">
    {label &&  <Label htmlFor="job-title" className="text-sm font-medium">
      {label}
               </Label>}
    <Textarea
      id="job-description"
      placeholder="Paste the complete job description here..."
      className="min-h-[120px] resize-none"
      required
      {...props}
    />
  </div>
);


type JobTitleInputProps = React.ComponentProps<typeof Input> & { label?: string };
export const JobInput = ({label, ...props}:JobTitleInputProps) => (
  (
  <div className="flex flex-col gap-2">

    {label &&  <Label htmlFor="job-title" className="text-sm font-medium">
      {label}
                </Label>}
                  <Input
                    {...props}
                  />
                
  </div>
  )
)
