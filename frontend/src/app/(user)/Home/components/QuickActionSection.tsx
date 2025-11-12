import JobDescriptionDialog from '@/components/jobDescriptionDialog'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Plus, FileText } from 'lucide-react'
import FileUploader from './FileUploader'
import { Button } from '@/components/ui/button'
import {  useState } from 'react'
import { useJob } from '@/app/jobProvider'
interface QuickActionSectionProps {
  children: React.ReactNode;
}

function QuickActionSection({ children }: QuickActionSectionProps) {
       const { jobData, updateJobData } = useJob();
      const [showDescriptionDialogue,setShowDescriptionDialogue] = useState(false)
  return (
       <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Get started with your next optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            {/* Upload Resume Section */}
            {children} 
         {jobData?.jobDescription ? (
  <Button
    variant="outline"
    className="w-full border-2 border-green-200 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 h-12 md:px-1"
    onClick={() => setShowDescriptionDialogue(true)}
  >
    <FileText className="w-4 h-4 mr-2 text-green-600 " />
    Job Description Added ✓
  </Button>
) : (
  <Button
    variant="outline"
    className="w-full border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200 h-12"
    onClick={() => setShowDescriptionDialogue(true)}
  >
    <FileText className="w-4 h-4 mr-2" />
    Add Job Description
  </Button>
)}
              <JobDescriptionDialog
                onOpenChange={setShowDescriptionDialogue}
                open={showDescriptionDialogue} />

              <Button className="mx-auto flex justify-center w-full" size="lg">
                Run analysis
              </Button>

    
            </CardContent>
          </Card>
  )
}

export default QuickActionSection
