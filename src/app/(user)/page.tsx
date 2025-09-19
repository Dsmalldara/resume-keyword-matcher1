import { generateMetadata } from "@/lib/generate-metadata";
import HomePage from "./HomePage";
import type { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Dashboard",
  description:
    "Track your resume optimization progress and job matching insights",
});

function DashboardPage() {
  return (
    <div>
      <HomePage />
    </div>
  );
}
export default DashboardPage;
