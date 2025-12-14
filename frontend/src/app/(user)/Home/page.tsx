import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import HomePage from "./components/HomePage";

export const metadata: Metadata = generateMetadata({
  title: "Home",
  description:
    "Track your resume optimization progress and job matching insights",
});

function page() {
  return <HomePage />;
}

export default page;
