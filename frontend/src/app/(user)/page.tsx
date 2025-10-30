import { generateMetadata } from "@/lib/generate-metadata";
import HomePage from "./Home/components/HomePage";
import type { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Home",
  description:
    "Track your resume optimization progress and job matching insights",
});

function HomePageComp() {
  return (
    <div>
      <HomePage />
    </div>
  );
}
export default HomePageComp;
