import { generateMetadata } from "@/lib/generate-metadata";

import type { Metadata } from "next";
import CoverLettersPage from "./components/CoverLettersPage";

export const metadata: Metadata = generateMetadata({
  title: "Cover Letters",
  description:
    "Create and manage personalized cover letters tailored to specific job applications",
});

function CoverLetterPage() {
  return (
    <div>
      <CoverLettersPage />
    </div>
  );
}
export default CoverLetterPage;
