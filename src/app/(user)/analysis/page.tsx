import { generateMetadata } from "@/lib/generate-metadata";

import type { Metadata } from "next";
import AnalysisPage from "./components/AnalysisPage";

export const metadata: Metadata = generateMetadata({
  title: "Analysis",
  description:
    "In-depth resume analysis and job matching insights to optimize your applications",
});

function AnalysisPageComp() {
  return (
    <div>
      <AnalysisPage />
    </div>
  );
}
export default AnalysisPageComp;
