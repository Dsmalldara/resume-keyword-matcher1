import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next/types";
import ResumePage from "./components/ResumePage";

export const metadata: Metadata = generateMetadata({
  title: "Resumes",
  description: "Manage your resumes and track their performance",
});
function ResumesSection() {
  return (
    <div>
      <ResumePage />
    </div>
  );
}

export default ResumesSection;
