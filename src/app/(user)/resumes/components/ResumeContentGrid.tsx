import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ResumeContentGridProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

function ResumeContentGrid({
  title,
  description,
  icon: Icon,
  children,
}: ResumeContentGridProps) {
  return (
    <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default ResumeContentGrid;
