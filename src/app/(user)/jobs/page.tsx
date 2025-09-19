import { generateMetadata } from "@/lib/generate-metadata";
import type { Metadata } from "next/types";
import JobDescriptionsPage from "./components/JobDescriptionsPage";

export const metadata: Metadata = generateMetadata({
  title: "Job Descriptions",
  description: "Manage your job descriptions and track their analysis",
});

export default function JobDescriptionsSection() {
  return <JobDescriptionsPage />;
}
